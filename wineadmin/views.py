from django.http import HttpResponse
from django.template import loader
from .forms import new_wine_form


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
        form_new_wine = new_wine_form(request.POST)

        if form_new_wine.is_valid():
            form_new_wine.save()
            
    else:
        form_new_wine = new_wine_form()

    template = loader.get_template('wineadmin/admin-panel.html')

    context = {
        "form_new_wine":form_new_wine
    }
    return HttpResponse(template.render(context, request))