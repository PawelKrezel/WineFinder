# WineFinder 🍷 - v1 - static design with vanilla client-side tech stack

### (description for v2 will be further down)

[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://pawelkrezel.github.io/WineFinder/)

At the moment this is an unfinished project. The idea for this app arose around July 2025 when I was discussing the flow of service with one of the ARMs at Hawksmoor in Knightsbridge. I might use this as inspiration for my Final Year Project module at the University of Westminster.

> A lightweight, static web app running on vanilla JavaScript and using JSON for a makeshift, low-cost DBMS. No backend needed - designed to run fully on GitHub pages for free because my cheapskate AGM would never pay to host a proper secure backend server running Django. (Yes, I am talking about you, Enli xx)
> Project is meant help outsiders cover a wine shift at Hawksmoor Knightsbridge

## ✨ Features ✨

✅ Form-based Wine Entry:
A structured input form for adding wine entries, including fields like name, grape, region, country, vintage, body, tannin, acidity, and optional sommelier notes.

✅ Live Review Table:
As wines are added, they're listed in an editable table below the form. This allows for quick visual verification and inline edits before final export.
User can also delete individual rows if added in error

✅ Client-side JSON Storage:
Uses Blob API and URL.createObjectURL to generate and download a complete JSON file without any server interaction in order to save money on hosting a backend server.
(This screams poverty. I can't, where is my lovely SQLlite database? 😭)

✅ JSON Upload Support:
Allows the manager to upload the current working JSON file. Newly added entries are appended to the parsed file data before export.

✅ Wine cellar mapping:
The digital map of the wine cellar has interactive cells. Upon selecting a wine from the drop down menu, the user can click the cells on the minimap to illustrate where the given wine is stored and the cells will turn red to showcase the selection. User can also unselect cells by clicking again on the cell that was selected earlier. If a wine cell is already occupied, it wil be filled with an 'X' symbol.

## 🛠 Tech Stack

- HTML5,
- Vanilla JavaScript (ES6+),
- CSS3,
- No build tools or external dependencies
- Runs on any static server (GitHub Pages recommended)

## Installation & Running Locally

You can run it locally with minimal setup:

```bash
git clone -b main https://github.com/PawelKrezel/WineFinder.git
cd WineFinder
```

## Which branch? 🌳

Codebase for v1 is kept in the "main" branch of this repository.

## Regarding license

## License for this repository applies to all versions of the WineFinder. It applies to all branches of this repository

---

# WineFinder 🍷 - v2 - System enriched with backend development.

> V2 of the WineFinder steps away from the cheap and tedious, work-around kind of approach with vanilla JavaScript and JSON as its makeshift DBMS from v1.
> V2 embraces dynamic server architecture and attempts to implement the features from v1 in a standard that is compliant with the industry standards.

## 🛠 Tech Stack

Backend is handled via:

- Django 5.1.7
- Python 3.13.7
- Hosted on render.com
- JavaScript (ES6+)
- HTML5
- CSS3

Please also refer to the **requirements.txt** file for more dependencies

## Which branch? 🌳

Codebase for v2 is kept in the "v2-django-branch" branch of this repository.

## Installation & Running Locally

You can run it locally with minimal setup:

```bash
git clone -b v2-django-branch --single-branch https://github.com/PawelKrezel/WineFinder.git
cd WineFinder
```

The proceed with best practices recommended for Django development and run server locally.
