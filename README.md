# WineFinder 🍷

[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://pawelkrezel.github.io/WineFinder/)  
A lightweight, static web app running on vanilla JavaScript and using JSON for a makeshift, low-cost DBMS. No backend needed - designed to run fully on GitHub pages for free because my cheapskate AGM would never pay to host a propper secure backend server running Django.
Project is meant help outsiders cover a wine shift at Hawksmoor Knightsbridge

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


## 🛠 Tech Stack
- HTML5,
- Vanilla JavaScript (ES6+),
- CSS3,
- No build tools or external dependencies
- Runs on any static server (GitHub Pages recommended)




## Installation & Running Locally

You can run it locally with minimal setup:

```bash
git clone https://github.com/PawelKrezel/WineFinder.git
cd WineFinder
