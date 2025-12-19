<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\News;
use App\Models\Admin;
use App\Models\Writer;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publishedNews = News::where('is_published', true)->get();
        $admin = Admin::first();
        $writer = Writer::first();

        if ($publishedNews->isEmpty() || !$admin || !$writer) {
            return;
        }

        $comments = [
            [
                'news_id' => $publishedNews->first()->id,
                'user_id' => $admin->id,
                'user_type' => 'App\Models\Admin',
                'content' => 'This is an excellent article. Very informative and well-written!',
                'is_approved' => true,
                'is_spam' => false,
            ],
            [
                'news_id' => $publishedNews->first()->id,
                'user_id' => $writer->id,
                'user_type' => 'App\Models\Writer',
                'content' => 'Great insights shared here. I agree with the main points.',
                'is_approved' => true,
                'is_spam' => false,
            ],
            [
                'news_id' => $publishedNews->first()->id,
                'user_id' => $admin->id,
                'user_type' => 'App\Models\Admin',
                'content' => 'This comment is spam and will be marked as such.',
                'is_approved' => false,
                'is_spam' => true,
            ],
            [
                'news_id' => $publishedNews->last()->id,
                'user_id' => $writer->id,
                'user_type' => 'App\Models\Writer',
                'content' => 'Waiting for moderation approval on this comment.',
                'is_approved' => false,
                'is_spam' => false,
            ],
        ];

        foreach ($comments as $comment) {
            Comment::create($comment);
        }
    }
}
