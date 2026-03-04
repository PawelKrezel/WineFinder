from django.http import HttpResponse
from django.template import loader

def wineadmin(request):
    template = loader.get_template('wineadmin/admin-panel.html')
    return HttpResponse(template.render())