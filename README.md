# semester_project_2 GoingOnce

## Description

This is a school project where we are building an auction site for students to sell and buy items via bidding.

The project focuses on working with APIs, following users through the process of registration and log in, managing their own profile page and listings, and a bidding process where user can bid on other listings.

## Features

- Vanilla JavaScript
- Tailwind v4.3.3
- Prettier plugin for Tailwind

## Prerequisities

- npm

## Installation

- Clone this project:
  https://github.com/Elljens/semester_project_2

- Install dependencies:

```bash
npm init -y
```

```bash
npm install -D tailwindcss@^4 @tailwindcss/cli
```

Create a CSS file (css/input.css) and add the following import:
@import "tailwindcss";

In the script section of package.json create to scripts:
"scripts": {
"dev": "tailwindcss -i ./css/input.css -o ./css/style.css --watch",
"build": "tailwindcss -i ./css/input.css -o ./css/style.css --minify"
}

## Running the project

- During development, run

```bash
npm runn dev
```

-When ready for production, run

```bash
npm run build
```

## Author

Ellen Jensen
