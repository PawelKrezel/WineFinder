
'''
This script populates the database with all the necessary wine slots.
It is meant to run once but I'll keep it here just in case database needs restoring.
Copy the code below into shell and run it there by calling the populate() function once.
'''

from wineadmin.models import Slot

# array of dimensions. columns rows
cellar =[
    [9, 25, 1],
    [9, 25, 2],
    [9, 25, 3],
    [7, 25, 4],
    [9, 25, 5],
    [8, 25, 6]
    ]

def populate():
    count = 0
    for shelf in cellar:
        for row in range(1, shelf[1]+1):
            for column in range(1, shelf[0]+1):
                generatedID= f"c{column}-r{row}-s{shelf[2]}"
                print(generatedID)
                count +=1
                Slot.objects.get_or_create(id=generatedID)
    print("slots added: ", count)
            

