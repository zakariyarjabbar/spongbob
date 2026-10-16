---
name: Sponge World
description: A playful underwater merchandise storefront following the supplied seven-screen reference.
colors:
  ink: "#171915"
  yellow: "#ffe539"
  blue: "#28c6ef"
  paper: "#fffefa"
  line: "#dfe1da"
  muted: "#64665f"
  pink: "#f5a9cf"
typography:
  display:
    fontFamily: "Bangers, cursive"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "0.015em"
  page-title:
    fontFamily: "Bangers, cursive"
    fontSize: "clamp(38px, 4.6vw, 62px)"
    fontWeight: 400
    lineHeight: 1.06
  body:
    fontFamily: "Nunito Sans, sans-serif"
    fontSize: "15px"
    lineHeight: 1.55
rounded:
  base: "12px"
  button: "9px 7px 10px 7px"
spacing:
  compact: "12px"
  regular: "24px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "12px 25px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "12px 25px"
---

# Design System: Sponge World

## Overview

The supplied seven-screen reference is the visual authority: an expressive cartoon world composed of paper surfaces, ink outlines, merchandise photography, familiar characters, bubbles and five-petal underwater flowers. Display lettering carries the humor; shopping controls stay readable and predictable.

## Colors

Yellow identifies primary actions, cart controls, highlights and the announcement strip. Ocean blue supports promotional scenes and decorative linework. Pink supplies a secondary collection accent. Paper, ink, muted text and pale dividers organize the commerce surfaces. Product-specific pastel backgrounds come from the shared catalog.

## Typography

Bangers is the self-hosted display face for the logo, hero, page headings and illustrated category labels. Nunito Sans is the self-hosted body and control face, with supplied regular, semibold and extrabold files. Display text uses normal weight; strong body weights distinguish product names, prices and actions. Desktop hero lettering scales independently from the page-title role.

## Layout

The main container is capped at 1280px with 48px desktop side margins. Shared layout changes occur at 1100px, 800px and 600px; catalog layouts also use 1050px, 760px and 390px thresholds. Four-column merchandise sections and illustrated category tiles recompose into two-column mobile grids. The shop sidebar becomes a filter drawer, the navigation becomes a mobile panel, and cart/checkout columns stack.

## Elevation & Depth

Most surfaces stay flat. Pastel image wells, thin ink borders, asymmetric corners and slightly rotated illustrations provide depth. The toast uses an ambient shadow; quick-cart hover adds a small hard offset shadow. Buttons and cards move subtly on interaction. Reduced-motion preferences disable movement and smooth scrolling.

## Shapes

The base radius is 12px. Main actions have gently asymmetric corners and an approximately 1.8px ink border. Category outlines use irregular rounded corners and a slight tilt. Circular swatches, character portraits, bubbles and icon buttons balance the rectangular shopping layout.

## Components

Primary buttons pair yellow fill, dark text and substantial weight; secondary buttons keep the same shape with a transparent surface. Focus indicators use a visible blue outline. Product cards contain fixed-proportion image wells, category labels, product links, prices, wishlist toggles and yellow cart actions. Required apparel options route shoppers to product details. Product galleries expose thumbnails and actual photographed color variants. Form fields carry visible labels and inline validation. Modal dialogs and drawers retain keyboard dismissal and focus management.

## Do's and Don'ts

- Do preserve the reference’s cartoon composition across the full shopping flow.
- Do keep prices, options and order details connected to the shared catalog/state.
- Do use Bangers for expressive display roles and Nunito Sans for reading and controls.
- Do retain visible focus states, touch-friendly controls and reduced-motion support.
- Don’t claim official affiliation, real payment processing or real delivery events.
- Don’t substitute the reference screenshot for interface components or add corporate glass effects.
