<?php
//* Set Localization (do not remove)
load_child_theme_textdomain('owid', apply_filters('child_theme_textdomain', get_stylesheet_directory() . '/languages', 'owid'));

/* Remove unnecessary stuff */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_print_styles', 'print_emoji_styles');
remove_filter('template_redirect', 'redirect_canonical');
add_filter('show_admin_bar', '__return_false');

// Allow uploading SVGs
function cc_mime_types($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}

add_filter('upload_mimes', 'cc_mime_types');

function build_static($post_ID, $post_after, $post_before)
{
    if ($post_after->post_status == "publish" || $post_before->post_status == "publish") {
        $current_user = wp_get_current_user();
        putenv('PATH=' . getenv('PATH') . ':/bin:/usr/local/bin:/usr/bin');
        // Unsets colliding .env variables between PHP and node apps
        // The DB password does not collide and hence is not listed here (DB_PASS (node) vs DB_PASSWORD (php))
        putenv('DB_HOST');
        putenv('DB_USER');
        putenv('DB_NAME');
        putenv('DB_PORT');
        $cmd = "cd " . dirname(__FILE__) . "/codelink && yarn tsn scripts/postUpdatedHook.ts " . escapeshellarg($current_user->user_email) . " " . escapeshellarg($current_user->display_name) . " " . escapeshellarg($post_after->ID) . " " . escapeshellarg($post_after->post_name) . " > /tmp/wp-static.log 2>&1 &";
        exec($cmd);
    }
}

add_action('post_updated', 'build_static', 10, 3);

add_theme_support('post-thumbnails');

add_post_type_support('page', 'excerpt');

function owid_init()
{
    // Re-enabling this. At the time it was removed, we decided to manage
    // categories through the OWID Admin, but that doesn't work yet.
    // unregister_taxonomy_for_object_type('post_tag', 'post');
    // unregister_taxonomy_for_object_type('post_tag', 'page');
    // unregister_taxonomy_for_object_type('category', 'post');
    // unregister_taxonomy_for_object_type('category', 'page');
}

add_action('init', 'owid_init');
