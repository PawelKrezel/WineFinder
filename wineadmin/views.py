from django.http import HttpResponse
from django.template import loader
from .forms import new_wine_form
from django.shortcuts import redirect
from .firebase_storage import upload_image
from django.contrib.auth.decorators import login_required
from .models import Wine, Slot

@login_required
def wineadmin(request):
    form_new_wine = new_wine_form()
    wines = Wine.objects.all()
    slots = Slot.objects.select_related("wine")

    slot_map = {}

    for slot in slots:
        if slot.wine:
            slot_map[slot.id] = str(slot.wine)

    template = loader.get_template('wineadmin/admin-panel.html')

    context = {
        "form_new_wine":form_new_wine,
        "wines":wines,
        "slots":slots,
        "slot_map":slot_map
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
    template = loader.get_template('wineadmin/admin-panel.html')

    context = {
        "form_new_wine":form_new_wine,
        "wines":wines
    }
    return HttpResponse(template.render(context, request))

@login_required
def update_wines(request):

    if request.method == "POST":

        for key in request.POST:
            if key.startswith("wine_name_"):
                wine_id = key.replace("wine_name_", "")
                wine = Wine.objects.get(id=wine_id)

                #delete logic
                if request.POST.get(f"delete_{wine_id}"):
                    wine.delete()
                    continue

                #update logic
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

                wine.save()

    return redirect("wineadmin")

@login_required
def allocate_wine_slots(request):
    
    if request.method == "POST":
        wine_id = request.POST.get("wine_id")
        slot_ids = request.POST.getlist("slots")

        wine = Wine.objects.get(id=wine_id)

        for slot_id in slot_ids:

            slot = Slot.objects.get(id=slot_id)

            slot.wine = wine
            slot.save()

    return redirect("wineadmin")