from django.http import HttpResponse
from django.template import loader
from .forms import new_wine_form
from django.shortcuts import redirect
from .firebase_storage import upload_image
def wineadmin(request):
    form_new_wine = new_wine_form()
    template = loader.get_template('wineadmin/admin-panel.html')

    context = {
        "form_new_wine":form_new_wine
    }
    return HttpResponse(template.render(context, request))

def workInProgress(request):
    template = loader.get_template("wineadmin/production-temp.html")
    return HttpResponse(template.render())

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

    template = loader.get_template('wineadmin/admin-panel.html')

    context = {
        "form_new_wine":form_new_wine
    }
    return HttpResponse(template.render(context, request))