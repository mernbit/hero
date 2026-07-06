# How The Animations Work (Explained Simply!)

This website is very bouncy and alive! We didn't want things to just "blink" onto the screen boringly. We want them to slide, spin, and pop!

Here is how we made the magic happen in the Navbar and Hero sections.

---

## 1. The Navbar (The Drawer Magic)

When you look at the website on a mobile phone, the menu items are hidden. When you tap the menu button, the menu slides out from the side like a drawer in your kitchen.

**How we built it:**
We used simple **CSS Transitions** (specifically Tailwind CSS). 
Imagine the menu is a piece of paper sitting just outside the edge of your computer screen, where you can't see it.
When you tap the button, we tell the computer: *"Take that piece of paper, and slide it over to the left by 100% so it covers the screen. And don't do it instantly—take exactly 0.5 seconds to do it smoothly!"*

If you tap close, we just tell the paper to slide back off the edge of the screen. No complicated math needed!

---

## 2. The Hero Section (The Hollywood Movie Magic)

The Hero section (the big ice cream or burger at the top) is much more complicated. Simple CSS wasn't strong enough, so we brought in a powerful animation director called **GSAP** (GreenSock Animation Platform). 

GSAP is like a movie director. It tells all the actors on the screen exactly *when* and *how* to move.

When you click on a new flavor (like changing from Vanilla to Chocolate), the GSAP director shouts "ACTION!" and plays a timeline of events in exact order:

**Scene 1: The Color Explosion**
- We have a tiny, invisible dot sitting right in the middle of the screen. It is the color of the *new* flavor.
- The director tells the dot: *"Grow 100 times bigger in half a second!"*
- The dot explodes outward until it covers the entire background like a giant wave of paint.

**Scene 2: The Old Cone Flies Away**
- At the exact same time the paint is exploding, the director tells the giant Vanilla cone: *"Spin around, shrink down, and fly off the screen to the left!"*

**Scene 3: The Text Changes**
- While the cone is flying away, the title ("Vanilla Bliss") fades out into darkness.
- Instantly, the new title ("Choco Delight") is typed in and fades into the light.

**Scene 4: The New Cone Arrives**
- Now that the stage is empty, the director tells the new Chocolate cone: *"Start from the bottom of the screen, spin, grow big, and land perfectly in the center!"*

**Scene 5: The Particle Explosion**
- Finally, the director looks at the 7 little floating pieces of fruit (particles) hiding behind the cone.
- He tells them: *"Explode outward into random directions!"* 
- We wrote a small math trick that picks random spots on the screen, so every time they explode, they land in different, floating spots!

### Why use GSAP?
Because if we tried to do all 5 of those scenes at the exact same time using regular CSS, it would be a messy traffic jam. GSAP lets us build a "Timeline", so Scene 2 happens perfectly after Scene 1, making it look like a smooth, professional movie!
