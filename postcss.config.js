module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
// This PostCSS configuration file is set up to use Tailwind CSS and Autoprefixer.
// It exports an object with a plugins array that includes the Tailwind CSS plugin and the Autoprefixer plugin.
// This setup allows you to use Tailwind CSS utility classes in your project and ensures that your CSS is compatible with different browsers by adding necessary vendor prefixes.
