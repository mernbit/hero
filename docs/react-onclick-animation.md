# How the `onClick` Triggers the Animation (The Domino Effect)

In the previous file, we talked about the "Movie Director" (GSAP) that plays the animation scenes. But how does the movie director know *when* to shout "ACTION!"? 

It all starts with a simple mouse click, which sets off a chain reaction. Think of it like setting up a line of dominos. When you push the first one, it knocks over the next, and the next!

Here is the step-by-step story of that chain reaction:

---

## Domino 1: The Finger Tap (`onClick`)
At the bottom of the Hero section, there are little buttons with pictures of the flavors. 
We wrote a tiny invisible listener on these buttons called `onClick`. 
When your finger taps the Chocolate button, the listener shouts: *"Hey! The user clicked Chocolate!"*

## Domino 2: The React Brain (`setActiveFlavor`)
When the `onClick` listener shouts, it talks directly to React's brain (specifically, a hook called `useState`).
We tell React: *"Forget Vanilla! The new active flavor is Chocolate!"*

## Domino 3: The Big Refresh (Re-rendering)
React is very obedient. As soon as it hears that the flavor changed to Chocolate, it quickly redraws the entire Hero section in the blink of an eye.
It updates the text to say "Choco Delight" and changes the cone picture. 

*Wait, if it redraws it instantly, why do we see an animation?*

## Domino 4: The Animation Trigger (`useGSAP`)
This is where the real magic happens! 

We have a special piece of code called `useGSAP` (the GSAP movie director we talked about). We gave this director a strict rule: **"Only run your movie when the `activeFlavor` changes."** (In code, this is called a *dependency array*).

So, the exact millisecond React redraws the screen with the new Chocolate text:
1. The GSAP director wakes up and notices the flavor changed!
2. Before you can even see the new Chocolate text with your eyes, GSAP pauses everything.
3. GSAP quickly grabs the old Vanilla cone and the new Chocolate cone.
4. GSAP hits "Play" on the animation timeline we built (growing the color circle, flying the old cone away, spinning the new cone in).

## Summary of the Chain Reaction

1. **You Click:** The `onClick` fires on the flavor button.
2. **State Updates:** React changes `activeFlavor` to the new flavor.
3. **GSAP Wakes Up:** The `useGSAP` hook sees the state changed.
4. **Animation Plays:** GSAP takes over the screen and animates the transition between the old state and the new state!

It is a perfect relay race from your mouse, to React, to the GSAP Animation Director!
