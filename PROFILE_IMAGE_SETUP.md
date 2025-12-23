# Profile Image Setup Instructions

## Adding Your Profile Picture

Your portfolio now displays your profile picture in two places:

1. **Sidebar** - At the bottom left of the sidebar (replacing the account icon)
2. **Index Page** - In the info section with a grayscale hover effect

## How to Add Your Profile Image

1. **Save your profile image** as `profile.jpg` in the `public/` folder
   - Recommended dimensions: 200x200px or larger (square format works best)
   - Supported formats: JPG, PNG, or WebP
   - File path: `public/profile.jpg`

2. **That's it!** The image will automatically appear in both locations.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: At least 200x200px (preferably square)
- **Location**: Save as `/public/profile.jpg`
- **Quality**: Clear, well-lit headshot recommended

## Styling Applied

- **Sidebar**: The profile image has a rounded border and will show an active state when on the about page
- **Index Page**: The profile image starts in grayscale and transitions to full color on hover

## Create Placeholder (Optional)

If you want to create a temporary placeholder image, you can:

1. Use an online placeholder generator
2. Use an image editing tool to create a simple avatar
3. Replace `profile.jpg` with your actual image whenever ready

**Note**: The paths `/profile.jpg` are used in both `components/Sidebar.tsx` and `pages/index.tsx`. Update both locations if you change the image path or filename.
