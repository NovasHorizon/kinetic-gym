<?php
/**
 * Sets up the WordPress site that powers the React app's Blog page (WordPress as a headless CMS).
 *
 * Usage: php setup-blog.php <path-to-wordpress> <admin-password>
 *
 * - Installs WordPress if needed (admin user: ironpeak-admin)
 * - Turns on pretty permalinks so the REST API is at /wp-json/wp/v2
 * - Adds a "Training Tips" category and sample posts with featured images
 * Safe to run more than once: existing posts are skipped.
 */
if (PHP_SAPI !== 'cli') {
    exit("Run this from the command line.\n");
}

[, $wpPath, $password] = $argv + [null, null, null];
if (! $wpPath || ! is_file("$wpPath/wp-config.php") || strlen((string) $password) < 8) {
    exit("Usage: php setup-blog.php <path-to-wordpress> <admin-password (8+ characters)>\n");
}

define('WP_INSTALLING', true); // lets wp-load.php run before WordPress is installed
require "$wpPath/wp-load.php";
require_once ABSPATH.'wp-admin/includes/upgrade.php';
require_once ABSPATH.'wp-admin/includes/file.php';
require_once ABSPATH.'wp-admin/includes/media.php';
require_once ABSPATH.'wp-admin/includes/image.php';

if (! is_blog_installed()) {
    wp_install('IronPeak Blog', 'ironpeak-admin', 'admin@ironpeak.test', false, '', $password);
    wp_delete_post(1, true); // "Hello world!"
    wp_delete_post(2, true); // "Sample Page"
    echo "Installed WordPress.\n";
}

global $wp_rewrite;
$wp_rewrite->set_permalink_structure('/%postname%/');
$wp_rewrite->flush_rules(false);
update_option('blogdescription', 'Training notes from the IronPeak coaches');

$category = term_exists('Training Tips', 'category') ?: wp_insert_term('Training Tips', 'category');
$categoryId = (int) $category['term_id'];

// Turns "## Heading" lines and plain paragraphs into WordPress blocks.
function to_blocks(string $text): string
{
    $blocks = [];
    foreach (preg_split('/\n\s*\n/', trim($text)) as $chunk) {
        $chunk = trim($chunk);
        $blocks[] = str_starts_with($chunk, '## ')
            ? "<!-- wp:heading -->\n<h2 class=\"wp-block-heading\">".esc_html(substr($chunk, 3))."</h2>\n<!-- /wp:heading -->"
            : "<!-- wp:paragraph -->\n<p>".esc_html($chunk)."</p>\n<!-- /wp:paragraph -->";
    }

    return implode("\n\n", $blocks);
}

$posts = [
    [
        'title' => '5 mistakes beginners make in their first month at the gym',
        'days_ago' => 2,
        'image' => '1534438327276-14e5300c3a48',
        'excerpt' => 'Skipping the warm-up, copying someone else\'s program and lifting too heavy too soon. Here is how to avoid the mistakes our coaches see most often.',
        'body' => <<<'TXT'
Your first month sets the tone for everything after it. These are the five mistakes our coaches see most often, and the simple fix for each.

## 1. Skipping the warm-up
Five minutes of light cardio and a few practice sets with an empty bar prepare your joints and make your working sets feel easier.

## 2. Copying someone else's program
The advanced lifter next to you trains for a different goal. Start with a simple full-body plan three days a week and add volume slowly.

## 3. Going too heavy too soon
Ego lifting is the fastest route to an injury. Pick a weight you can lift for every rep with good form, then add a little each week.

## 4. Doing only cardio
Treadmill time is useful, but strength training is what changes your shape and protects your joints. Aim for both.

## 5. Not asking for help
Every coach on our floor is there to answer questions. Ask them to check your squat or deadlift form. That is what they are for.
TXT,
    ],
    [
        'title' => 'What to eat before a morning workout',
        'days_ago' => 6,
        'image' => '1517836357463-d25dfeac3438',
        'excerpt' => 'Training at 6 am on an empty stomach? A small, easy-to-digest snack 30 to 60 minutes before can make a big difference to your energy.',
        'body' => <<<'TXT'
Training first thing in the morning is a great habit, but an empty tank can leave you dizzy halfway through your session. A small snack 30 to 60 minutes before usually solves it.

## Quick options that work
A banana with a spoon of peanut butter. A small bowl of poha. Two slices of toast with curd. A handful of soaked almonds with a glass of milk. Keep it light and easy to digest.

## What to avoid
Heavy, oily or very high-fibre food right before training can upset your stomach. Save the parathas for after your workout.

## After training
Within an hour or two, eat a proper meal with protein and carbohydrates, such as eggs with roti, dal with rice, or paneer with vegetables. This is when your muscles recover and grow.
TXT,
    ],
    [
        'title' => 'How many days a week should you train?',
        'days_ago' => 11,
        'image' => '1599058917212-d750089bc07e',
        'excerpt' => 'More is not always better. The right number of training days depends on your goal, your recovery and how consistent you can be.',
        'body' => <<<'TXT'
The honest answer is: as many days as you can keep doing for months, not weeks. Consistency beats intensity every time.

## Beginners: 3 days
Three full-body sessions a week, with a rest day between each, is enough to build strength and learn the main lifts properly.

## Intermediate: 4 to 5 days
Once the basics feel solid, an upper/lower split or a push/pull/legs routine lets you train each muscle twice a week with more volume.

## Listen to recovery
If you sleep badly, feel sore for days or your lifts keep going down, you need more rest, not more training. Rest days are when progress actually happens.
TXT,
    ],
    [
        'title' => 'Sleep: the recovery tool most people ignore',
        'days_ago' => 17,
        'image' => '1544367567-0f2fcb009e0b',
        'excerpt' => 'You can train hard and eat well, but without 7 to 9 hours of sleep your results will stall. Here is why sleep matters so much.',
        'body' => <<<'TXT'
Members often ask us which supplement to buy. Our first answer is always the same: are you sleeping 7 to 9 hours a night?

## Why it matters
Deep sleep is when your body releases most of its growth hormone and repairs the muscle you broke down in training. Short sleep also raises hunger hormones, which makes fat loss harder.

## Simple habits that help
Keep a fixed bedtime, even on weekends. Put your phone away 30 minutes before sleep. Avoid tea or coffee after 4 pm. Keep your room dark and cool.

## The bottom line
No program or protein powder can make up for poor sleep. Fix this first and everything else in the gym gets easier.
TXT,
    ],
];

foreach ($posts as $p) {
    $existing = (new WP_Query(['title' => $p['title'], 'post_type' => 'post', 'post_status' => 'any', 'fields' => 'ids']))->posts;
    if ($existing) {
        echo "Skipped (exists): {$p['title']}\n";

        continue;
    }

    $date = gmdate('Y-m-d H:i:s', strtotime("-{$p['days_ago']} days"));
    $postId = wp_insert_post([
        'post_title' => $p['title'],
        'post_content' => to_blocks($p['body']),
        'post_excerpt' => $p['excerpt'],
        'post_status' => 'publish',
        'post_author' => 1,
        'post_category' => [$categoryId],
        'post_date_gmt' => $date,
        'post_date' => get_date_from_gmt($date),
    ], true);
    if (is_wp_error($postId)) {
        exit('Could not create post: '.$postId->get_error_message()."\n");
    }

    // Unsplash URLs have no file extension, so download first and name the file ourselves.
    $tmp = download_url("https://images.unsplash.com/photo-{$p['image']}?auto=format&fit=crop&w=1200&h=750&q=70");
    if (! is_wp_error($tmp)) {
        $attachmentId = media_handle_sideload(['name' => sanitize_title($p['title']).'.jpg', 'tmp_name' => $tmp], $postId, $p['title']);
        if (! is_wp_error($attachmentId)) {
            set_post_thumbnail($postId, $attachmentId);
        }
    }

    echo "Created: {$p['title']}\n";
}

echo "Blog ready. REST API: ".rest_url('wp/v2/posts')."\n";
