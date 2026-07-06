# How Our Website Works (Explained Simply!)

Imagine you have a magical coloring book. The pictures inside the book stay exactly the same, but the colors, words, and stickers change depending on who is holding the book!

That is exactly how this website works. It's called a **Multi-Tenant Architecture**.

## What is Multi-Tenancy?
"Multi-tenant" is just a fancy word for "Many Shop Owners Sharing One Storefront." 

Imagine building a physical shop. Instead of building a brand new brick-and-mortar shop for an ice cream seller, and then building another brand new shop from scratch for a burger seller, we just built **one super-shop**. 

When the Ice Cream seller unlocks the front door, the shop instantly paints itself purple, puts up Ice Cream menus, and says "The Creamery". But if the Burger seller unlocks the exact same door, the shop instantly paints itself red, puts up Burger menus, and says "ABC Restaurant".

They are sharing the same building (our code), but seeing their own furniture (their data)!

---

## How Does It Do That? (The Lego Pieces)

Here is how the different files in our code work together to make this magic happen:

### 1. `App.jsx` (The Front Door)
This is the very first place a visitor goes. It acts like a traffic cop. It looks at the website link you typed in (like `/the-creamery` or `/abc-resturant`). It takes that name (called a "slug") and passes it to the next room.

### 2. `TenantContext.jsx` (The Brain)
This is the most important piece! It takes the name the front door gave it (like "abc-resturant") and runs to the filing cabinet (`public/api/`).
- It grabs the correct file (`abc-resturant.json`).
- It reads the file and says: "Aha! This shop wants red paint and burger pictures!"
- It then magically squirts the new paint colors across the entire website at once using CSS variables. 

### 3. The JSON Files (The Filing Cabinet)
Located in `public/api/`, these are simple text files. You can think of them as the "Instruction Manual" for each shop. 
If you want to change a price or add a new flavor, you don't need to write complicated code. You just open the shop's JSON file, change the text, and save it. The website will read it and update instantly!

### 4. `Hero.jsx`, `Menu.jsx`, and `Navbar.jsx` (The Blank Canvases)
These are the actual pages you see on the screen. 
But here is the secret: **they don't know anything about ice cream or burgers.** 
They are just empty boxes. When the page loads, they ask `TenantContext.jsx` (The Brain): *"Hey, what words should I put here? What picture should I show?"* The Brain hands them the correct words and pictures from the JSON file, and they put them on the screen!

---

## Summary
1. You visit `/the-creamery`.
2. **App** says "Okay, load the Creamery data!"
3. **The Brain (Context)** reads `the-creamery.json`.
4. **The Brain** paints the website purple.
5. **The Pages (Hero & Menu)** ask the Brain for the pictures, and fill in the blanks with Ice Cream!
