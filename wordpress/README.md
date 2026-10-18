# WordPress blog (headless CMS)

The React site's **Blog** page reads posts from WordPress through its built-in REST API.
Coaches write posts in the normal WordPress editor, and they appear on the website automatically.

```
React Blog page  --GET /wp-json/wp/v2/posts?_embed-->  WordPress  -->  MySQL (ironpeak_blog)
```

## Setup

1. Download WordPress from https://wordpress.org/download/ and unzip it, e.g. next to this project.
2. Create a MySQL database called `ironpeak_blog`.
3. Copy `wp-config-sample.php` to `wp-config.php`, fill in the database details, and add:

   ```php
   define( 'WP_HOME', 'http://localhost:8080' );
   define( 'WP_SITEURL', 'http://localhost:8080' );
   ```

4. Install WordPress and add the sample posts (admin user: `ironpeak-admin`):

   ```bash
   php wordpress/setup-blog.php /path/to/wordpress "choose-a-password"
   ```

5. Run WordPress:

   ```bash
   php -S localhost:8080 -t /path/to/wordpress
   ```

6. Tell the React app where WordPress is, in `client/.env.local`:

   ```
   VITE_WP_API=http://localhost:8080/wp-json/wp/v2
   ```

   Restart `npm run dev` after changing it.

## How it works

- `setup-blog.php` installs WordPress, turns on pretty permalinks (needed for `/wp-json`), creates a "Training Tips" category and four posts with featured images. Running it again skips posts that already exist.
- `client/src/pages/Blog.jsx` fetches the posts with `_embed=wp:featuredmedia` to get the images in the same request.
- Titles and excerpts are shown as plain text (not injected HTML), so a compromised blog can't run scripts on the main site.
- WordPress sends CORS headers for its REST API, so the React app can call it from another port or domain.
