from django.http import HttpResponse
from django.template import loader
from .forms import new_wine_form
from django.shortcuts import redirect
from .firebase_storage import upload_image
from django.contrib.auth.decorators import login_required
from .models import Wine, Slot
import json
from datetime import datetime
from django.db.models import Count, Q

# Added for the iOS development. API needed 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Wine
from .serializers import WineAdminSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q

# after refactoring
@login_required
def table_of_wines(request):
    wines = Wine.objects.all().order_by('-vintage', 'wine_name')

    template = loader.get_template('wineadmin/table-of-wines.html')
    context = {
        "wines": wines
    }

    return HttpResponse(template.render(context, request))

@login_required
def cellar_map_editable(request):

    slots = Slot.objects.select_related("wine")
    wines = Wine.objects.all().order_by('-vintage', 'wine_name')
    slot_map = {}

    for slot in slots:
        if slot.wine:
            slot_map[slot.id] = {
                "name": slot.wine.wine_name,
                "grape": slot.wine.grape,
                "vintage": slot.wine.vintage,
                "region": slot.wine.region,
                "country": slot.wine.country_of_origin,
                "image": slot.wine.imageURL
            }

    template = loader.get_template("wineadmin/cellar-map-editable.html")

    context = {
        "slots": slots,
        "wines":wines,
        "slot_map": json.dumps(slot_map)
    }

    return HttpResponse(template.render(context, request))

@login_required
def new_wine(request):

    form_new_wine = new_wine_form()
    template = loader.get_template('wineadmin/new-wine-form.html')
    context = {
        "form_new_wine": form_new_wine
    }

    return HttpResponse(template.render(context, request))

@login_required
def dbms_tools(request):
    template = loader.get_template("wineadmin/dbms-extras.html")
    return HttpResponse(template.render({}, request))

@login_required
def wineadmin(request):
    template = loader.get_template('wineadmin/admin-panel.html')
    return HttpResponse(template.render({},request))

@login_required
def add_new_wine(request):
    if request.method == "POST":
        form_new_wine = new_wine_form(request.POST, request.FILES)

        if form_new_wine.is_valid():
            wine = form_new_wine.save(commit=False)

            if request.FILES.get("image"):
                image_url = upload_image(request.FILES["image"])
                wine.imageURL = image_url

            wine.save()
            return redirect(f"/wine/{wine.id}/?created=true")
    return redirect("new_wine")

@login_required
def update_wines(request):

    if request.method == "POST":

        for key in request.POST:
            if key.startswith("wine_name_"):
                wine_id = key.replace("wine_name_", "")
                wine = Wine.objects.get(id=wine_id)

                # delete logic
                if request.POST.get(f"delete_{wine_id}"):
                    wine.delete()
                    continue

                # update logic
                # text and select fields 
                wine.wine_name = request.POST.get(f"wine_name_{wine_id}")
                wine.grape = request.POST.get(f"grape_{wine_id}")
                wine.region = request.POST.get(f"region_{wine_id}")
                wine.country_of_origin = request.POST.get(f"country_of_origin_{wine_id}")
                wine.vintage = request.POST.get(f"vintage_{wine_id}")
                wine.body = request.POST.get(f"body_{wine_id}")
                wine.tannin = request.POST.get(f"tannin_{wine_id}")
                wine.acidity = request.POST.get(f"acidity_{wine_id}")
                wine.glass = request.POST.get(f"glass_{wine_id}")
                wine.coravin = request.POST.get(f"coravin_{wine_id}")
                wine.btl_only = request.POST.get(f"btl_only_{wine_id}")
                wine.sommNotes = request.POST.get(f"sommNotes_{wine_id}")
                wine.colour = request.POST.get(f"colour_{wine_id}")

                # image field
                if request.FILES.get(f"image_{wine_id}"):
                    image_url = upload_image(request.FILES[f"image_{wine_id}"])
                    wine.imageURL = image_url
                wine.save()

    return redirect("table_of_wines")

@login_required
def allocate_wine_slots(request):
    
    if request.method == "POST":
        wine_id = request.POST.get("wine_id")
        slot_ids = request.POST.getlist("slots")
        empty_code = "empty-slots"

        if wine_id != empty_code:
            wine = Wine.objects.get(id=wine_id)

        for slot_id in slot_ids:

            slot = Slot.objects.get(id=slot_id)

            # Either assign wine to the slot or make it empty
            if wine_id == empty_code:
                slot.wine = None
            else:
                slot.wine = wine

            slot.save()

    return redirect("cellar_map_editable")

@login_required
def import_wines(request):

    if request.method == "POST" and request.FILES.get("wine_file"):
        file = request.FILES["wine_file"]

        try:
            data = json.load(file)
        except:
            return redirect("wineadmin")
        
        for item in data:

            wine = Wine.objects.create(
                wine_name = item.get("wine_name", "⚠️ FAILED"),
                grape = item.get("grape", "⚠️ FAILED"),
                region = item.get("region", "⚠️ FAILED"),
                country_of_origin = item.get("country_of_origin", "⚠️ FAILED"),
                vintage = int(item.get("vintage", 0000)),

                body = item.get("body", "⚠️ FAILED"),
                tannin = item.get("tannin", "⚠️ FAILED"),
                acidity = item.get("acidity", "⚠️ FAILED"),
                glass = item.get("glass", "⚠️ FAILED"),
                coravin = item.get("coravin", "⚠️ FAILED"),
                btl_only = item.get("btl_only", "⚠️ FAILED"),
                sommNotes = item.get("sommNotes", "⚠️ FAILED"),
                colour = item.get("colour", "⚠️ FAILED"),
                imageURL = item.get("imageURL") or None
            )

            if "slots" in item:
                slot_ids = item.get("slots", [])

                for slot_id in slot_ids:
                    try:
                        slot = Slot.objects.get(id=slot_id)
                        slot.wine = wine
                        slot.save()
                    except:
                        pass
    return redirect("wineadmin")

def search(request):
    query = request.GET.get("query")
    query_lower = (query or "").lower()

    FILTER_MAPPINGS = {
    # --- BODY ---
    "light body": "light-body",
    "light bodied": "light-body",
    "lght body": "light-body",
    "lt body": "light-body",
    "lght bodied": "light-body",
    "lt bodied": "light-body",

    "medium body": "medium-body",
    "medium bodied": "medium-body",
    "med body": "medium-body",
    "med bodied": "medium-body",
    "md bodied": "medium-body",
    "md body": "medium-body",

    "full body": "full-body",
    "full bodied": "full-body",
    "full bod": "full-body",
    "full bodd": "full-body",
    "fl bodd": "full-body",
    "punchy": "full-body",

    # --- TANNIN ---
    "no tannin": "no-tannin",
    "no tannins": "no-tannin",
    "no tanin": "no-tannin",
    "no tanins": "no-tannin",
    "no tanns": "no-tannin",

    "light tannin": "light-tannin",
    "light tannins": "light-tannin",
    "lght tannin": "light-tannin",
    "lt tannin": "light-tannin",
    "lght tannins": "light-tannin",
    "lt tannins": "light-tannin",
    "easy tannins": "light-tannin",
    "minimal tannins": "light-tannin",

    "medium tannin": "medium-tannin",
    "medium tannins": "medium-tannin",
    "med tannin": "medium-tannin",
    "med tannins": "medium-tannin",
    "md tannins": "medium-tannin",
    "md tannin": "medium-tannin",

    "full tannin": "full-tannin",
    "full tannins": "full-tannin",
    "high tannin": "full-tannin",
    "high tannins": "full-tannin",
    "strong tannins": "full-tannin",
    "stronger tannins": "full-tannin",
    "strong tann": "full-tannin",
    "strong tanns": "full-tannin",
    "stronger tanns": "full-tannin",

    # --- ACIDITY ---
    "low acidity": "low-acidity",
    "low acid": "low-acidity",
    "lo acidity": "low-acidity",
    "no acidity": "low-acidity",
    "light acidity": "low-acidity",
    "lght acidity": "low-acidity",
    "lighter acidity": "low-acidity",
    "light acid": "low-acidity",

    "medium acidity": "medium-acidity",
    "medium acid": "medium-acidity",
    "med acidity": "medium-acidity",
    "med acid": "medium-acidity",
    "md acidity": "medium-acidity",
    "med acid": "medium-acidity",

    "high acidity": "high-acidity",
    "high acid": "high-acidity",
    "hi acidity": "high-acidity",
    "hi acid": "high-acidity"}

    mapped_values = [
        value for key, value in FILTER_MAPPINGS.items()
        if key in query_lower
        ]

    wines = Wine.objects.all().annotate(
        has_notes=Count('id', filter=Q(sommNotes__isnull=False) & ~Q(sommNotes="")),
        has_image=Count('id', filter=Q(imageURL__isnull=False) & ~Q(imageURL="")),
        slot_count=Count('slots')
    )

    if query:
        filters = Q(wine_name__icontains=query) | \
                Q(grape__icontains=query) | \
                Q(region__icontains=query) | \
                Q(country_of_origin__icontains=query) | \
                Q(vintage__icontains=query) | \
                Q(sommNotes__icontains=query) | \
                Q(colour__icontains=query)

        filters |= Q(body__icontains=query) | \
                Q(tannin__icontains=query) | \
                Q(acidity__icontains=query)

        for value in mapped_values:
            filters |= Q(body=value) | \
                    Q(tannin=value) | \
                    Q(acidity=value)

        wines = wines.filter(filters)

    template = loader.get_template("search/search.html")

    context = {
        "wines":wines.order_by('-vintage', 'wine_name'),
        "query":query
    }
    
    return HttpResponse(template.render(context, request))


def wine_detail(request, wine_id):
    wine = Wine.objects.get(id=wine_id)
    created = request.GET.get("created") == "true"
    slots = Slot.objects.filter(wine=wine)
    slot_map = {}

    for slot in slots:
        slot_map[slot.id] = True  

    has_slots = len(slot_map) > 0
    template = loader.get_template("search/details.html")
    context = {
        "wine": wine,
        "slot_map": json.dumps(slot_map),
        "has_slots": has_slots,
        "created":created
    }

    return HttpResponse(template.render(context, request))

@login_required
def export_wines(request):

    include_slots = request.GET.get("include_slots") == "true"
    wines = Wine.objects.all().order_by('-vintage', 'wine_name')
    data = []

    wine_slots_map = {}

    if include_slots:
        slots = Slot.objects.select_related("wine")

        for slot in slots:
            if slot.wine:
                wine_id = slot.wine.id

                if wine_id not in wine_slots_map:
                    wine_slots_map[wine_id] = []

                wine_slots_map[wine_id].append(slot.id)

    for wine in wines:
        wine_data = {
            "wine_name": wine.wine_name,
            "grape": wine.grape,
            "region": wine.region,
            "country_of_origin": wine.country_of_origin,
            "vintage": wine.vintage,
            "body": wine.body,
            "tannin": wine.tannin,
            "acidity": wine.acidity,
            "glass": wine.glass,
            "coravin": wine.coravin,
            "btl_only": wine.btl_only,
            "sommNotes": wine.sommNotes or "",
            "colour":wine.colour,
            "imageURL":wine.imageURL,
        }

        if include_slots:
            wine_data["slots"] = wine_slots_map.get(wine.id, [])

        data.append(wine_data)

    response = HttpResponse(
    json.dumps(data, indent=4, ensure_ascii=False),
    content_type='application/json; charset=utf-8')

    if include_slots:
        filename = f"wines_copy_as_of_{datetime.now().strftime('%Y-%m-%d_%H%M_WITH_slot_allocation')}.json"
    else:
        filename = f"wines_copy_as_of_{datetime.now().strftime('%Y-%m-%d_%H%M_no_slot_allocation')}.json"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def api_wines(request):
    print("FILES:", request.FILES)
    print("DATA:", request.data)
    if request.method == 'GET':
        wines = Wine.objects.all().order_by('-vintage', 'wine_name')
        serializer = WineAdminSerializer(wines, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WineAdminSerializer(data=request.data)
        
        if serializer.is_valid():
            wine = serializer.save()
            #handling slot allocation
            slot_ids = request.data.get("slots", [])
            if slot_ids is not None:
                for slot_id in slot_ids:
                    try:
                        slot = Slot.objects.get(id=slot_id)
                        slot.wine = wine
                        slot.save()
                    except Slot.DoesNotExist:
                        pass

            #handling image upload
            if request.FILES.get("image"):
                image_url = upload_image(request.FILES["image"])
                wine.imageURL = image_url
                wine.save()

            return Response(WineAdminSerializer(wine).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_wine_detail(request, wine_id):

    wine = get_object_or_404(Wine, id=wine_id)

    if request.method == 'PUT':
        serializer = WineAdminSerializer(wine, data=request.data)

        if serializer.is_valid():
            wine = serializer.save()
            
            #handling slot allocation
            slot_ids = request.data.get("slots", [])
            if slot_ids is not None:
                Slot.objects.filter(wine=wine).update(wine=None)
                for slot_id in slot_ids:
                    try:
                        slot = Slot.objects.get(id=slot_id)
                        slot.wine = wine
                        slot.save()
                    except Slot.DoesNotExist:
                        pass

            #handling image upload
            if request.FILES.get("image"):
                image_url = upload_image(request.FILES["image"])
                wine.imageURL = image_url
                wine.save()

            return Response(WineAdminSerializer(wine).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        wine.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)