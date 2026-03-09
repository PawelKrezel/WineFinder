from django import forms
from .models import Wine

class new_wine_form(forms.ModelForm):
    image = forms.ImageField(required=False)
    class Meta:
        model = Wine
        fields = ["wine_name", "grape", "region", "country_of_origin", "vintage", "body", 
                "tannin", "acidity", "glass", "coravin", "btl_only", "sommNotes"]
        
        #attributes for the form elements
        widgets = {
            "wine_name": forms.TextInput(
                attrs={
                    "placeholder":"Name 🏷️",
                    "class":"commonStyle commonStyleAsBlock",
                    "required":True
                }
            ),
            "grape": forms.TextInput(
                attrs={
                    "placeholder":"Grape 🍇",
                    "class":"commonStyle commonStyleAsBlock",
                    "required":True
                }
            ),
            "region": forms.TextInput(
                attrs={
                    "placeholder":"Region 📌",
                    "class":"commonStyle commonStyleAsBlock",
                    "required":True
                }
            ),
            "country_of_origin": forms.TextInput(
                attrs={
                    "placeholder":"Country 🗺️",
                    "class":"commonStyle commonStyleAsBlock",
                    "required":True
                }
            ),
            "vintage": forms.NumberInput(
                attrs={
                    "placeholder":"Vintage 🗓️",
                    "class":"commonStyle commonStyleAsBlock",
                    "required":True
                }
            ),
            "body":forms.RadioSelect(attrs={"class":"commonStyle"}),
            "tannin":forms.RadioSelect(attrs={"class":"commonStyle"}),
            "acidity":forms.RadioSelect(attrs={"class":"commonStyle"}),
            "glass":forms.RadioSelect(attrs={"class":"commonStyle"}),
            "coravin":forms.RadioSelect(attrs={"class":"commonStyle"}),
            "btl_only":forms.RadioSelect(attrs={"class":"commonStyle"}),
        }

        
    # Django automatically added blank choice ("---------") for the radio field.
    # Function below, solves this issue
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["body"].choices = Wine.BODY_CHOICES
        self.fields["tannin"].choices = Wine.TANNIN_CHOICES
        self.fields["acidity"].choices = Wine.ACIDITY_CHOICES
        self.fields["glass"].choices = Wine.GLASS_CHOICES
        self.fields["coravin"].choices = Wine.CORAVIN_CHOICES
        self.fields["btl_only"].choices = Wine.BTL_ONLY_CHOICES