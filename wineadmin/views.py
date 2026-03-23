from django.http import HttpResponse
from django.template import loader
from .forms import new_wine_form
from django.shortcuts import redirect
from django.urls import reverse
from django.http import HttpResponseRedirect
from .firebase_storage import upload_image
from django.contrib.auth.decorators import login_required
from .models import Wine, Slot
import json
from datetime import datetime

@login_required
def wineadmin(request):
    form_new_wine = new_wine_form()
    wines = Wine.objects.all()
    slots = Slot.objects.select_related("wine")

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

    template = loader.get_template('wineadmin/admin-panel.html')

    context = {
        "form_new_wine":form_new_wine,
        "wines":wines,
        "slots":slots,
        "slot_map": json.dumps(slot_map)
    }
    return HttpResponse(template.render(context, request))

def workInProgress(request):
    template = loader.get_template("wineadmin/production-temp.html")
    return HttpResponse(template.render())

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
            return redirect("wineadmin")
            
    else:
        form_new_wine = new_wine_form()

    wines = Wine.objects.all()
    slots = Slot.objects.select_related("wine")

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

    wines = Wine.objects.all()
    template = loader.get_template('wineadmin/admin-panel.html')

    context = {
        "form_new_wine":form_new_wine,
        "wines":wines,
        "slots":slots,
        "slot_map": json.dumps(slot_map)
    }
    return HttpResponse(template.render(context, request))

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

                # image field
                if request.FILES.get(f"image_{wine_id}"):
                    image_url = upload_image(request.FILES[f"image_{wine_id}"])
                    wine.imageURL = image_url
                wine.save()

    return HttpResponseRedirect(reverse("wineadmin") + "#headers-editable-wine-table")

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

    return HttpResponseRedirect(reverse("wineadmin") + "#mapContainer")

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

                sommNotes = item.get("sommNotes", "⚠️ FAILED")
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

    wines = Wine.objects.all()

    if query:
        wines = wines.filter(
            wine_name__icontains=query
        ) | wines.filter(
            grape__icontains=query
        ) | wines.filter(
            region__icontains=query
        ) | wines.filter(
            country_of_origin__icontains=query
        ) | wines.filter(
            vintage__icontains=query
        ) | wines.filter(
            tannin__icontains=query
        ) | wines.filter(
            acidity__icontains=query
        ) | wines.filter(
            body__icontains=query
        )

    template = loader.get_template("search/search.html")

    context = {
        "wines":wines,
        "query":query
    }
    
    return HttpResponse(template.render(context, request))


def wine_detail(request, wine_id):

    wine = Wine.objects.get(id=wine_id)
    slots = Slot.objects.filter(wine=wine)
    slot_map = {}

    for slot in slots:
        slot_map[slot.id] = True  

    template = loader.get_template("search/details.html")

    context = {
        "wine": wine,
        "slot_map": json.dumps(slot_map)
    }

    return HttpResponse(template.render(context, request))

@login_required
def export_wines(request):

    include_slots = request.GET.get("include_slots") == "true"
    wines = Wine.objects.all()
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
            "sommNotes": wine.sommNotes or ""
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
