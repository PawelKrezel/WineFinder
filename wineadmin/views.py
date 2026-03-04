from django.http import HttpResponse
from django.template import loader

def wineadmin(request):
    template = loader.get_template('wineadmin/admin-panel.html')
    return HttpResponse(template.render())

def workInProgress(request):
    template = loader.get_template("wineadmin/production-temp.html")
    return HttpResponse(template.render())