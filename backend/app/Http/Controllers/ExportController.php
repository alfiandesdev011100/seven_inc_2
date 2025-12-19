<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Export news to CSV
     */
    public function newsCSV(Request $request)
    {
        try {
            $status = $request->get('status');
            $categoryId = $request->get('category_id');
            $writerId = $request->get('writer_id');

            $query = News::query();

            if (!empty($status)) {
                $query->status($status);
            }
            if (!empty($categoryId)) {
                $query->byCategory($categoryId);
            }
            if (!empty($writerId)) {
                $query->byWriter($writerId);
            }

            $newsList = $query->get();

            $filename = 'news_' . date('Y-m-d_His') . '.csv';

            return response()->streamDownload(function () use ($newsList) {
                $handle = fopen('php://output', 'w');

                // Header
                fputcsv($handle, [
                    'ID',
                    'Title',
                    'Author',
                    'Status',
                    'Published',
                    'Category',
                    'Excerpt',
                    'Created At',
                    'Updated At',
                ]);

                // Data
                foreach ($newsList as $news) {
                    fputcsv($handle, [
                        $news->id,
                        $news->title,
                        $news->author,
                        $news->status ?? 'draft',
                        $news->is_published ? 'Yes' : 'No',
                        optional($news->category)->name ?? '',
                        $news->excerpt,
                        $news->created_at,
                        $news->updated_at,
                    ]);
                }

                fclose($handle);
            }, $filename, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Export news to Excel (simple format)
     */
    public function newsExcel(Request $request)
    {
        try {
            $status = $request->get('status');
            $categoryId = $request->get('category_id');
            $writerId = $request->get('writer_id');

            $query = News::query();

            if (!empty($status)) {
                $query->status($status);
            }
            if (!empty($categoryId)) {
                $query->byCategory($categoryId);
            }
            if (!empty($writerId)) {
                $query->byWriter($writerId);
            }

            $newsList = $query->get();

            $filename = 'news_' . date('Y-m-d_His') . '.xlsx';

            // Using native Excel format (tab-separated for maximum compatibility)
            $headers = [
                'ID',
                'Title',
                'Author',
                'Status',
                'Published',
                'Category',
                'Excerpt',
                'Created At',
                'Updated At',
            ];

            $data = [];
            foreach ($newsList as $news) {
                $data[] = [
                    $news->id,
                    $news->title,
                    $news->author,
                    $news->status ?? 'draft',
                    $news->is_published ? 'Yes' : 'No',
                    optional($news->category)->name ?? '',
                    $news->excerpt,
                    $news->created_at,
                    $news->updated_at,
                ];
            }

            // Create TSV (can be opened in Excel)
            return response()->streamDownload(function () use ($headers, $data) {
                $handle = fopen('php://output', 'w');

                // BOM for UTF-8 Excel compatibility
                fwrite($handle, "\xEF\xBB\xBF");

                fputcsv($handle, $headers, "\t");

                foreach ($data as $row) {
                    fputcsv($handle, $row, "\t");
                }

                fclose($handle);
            }, $filename, [
                'Content-Type' => 'application/vnd.ms-excel',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Export news to JSON
     */
    public function newsJSON(Request $request)
    {
        try {
            $status = $request->get('status');
            $categoryId = $request->get('category_id');
            $writerId = $request->get('writer_id');

            $query = News::query();

            if (!empty($status)) {
                $query->status($status);
            }
            if (!empty($categoryId)) {
                $query->byCategory($categoryId);
            }
            if (!empty($writerId)) {
                $query->byWriter($writerId);
            }

            $newsList = $query->get();

            $filename = 'news_' . date('Y-m-d_His') . '.json';

            return response()->download(
                response()->streamDownload(function () use ($newsList) {
                    echo json_encode($newsList->map(function ($news) {
                        return [
                            'id' => $news->id,
                            'title' => $news->title,
                            'slug' => $news->slug,
                            'author' => $news->author,
                            'excerpt' => $news->excerpt,
                            'body' => $news->body,
                            'status' => $news->status ?? 'draft',
                            'is_published' => (bool) $news->is_published,
                            'published_at' => $news->published_at,
                            'category' => optional($news->category)->name,
                            'created_at' => $news->created_at,
                            'updated_at' => $news->updated_at,
                        ];
                    }), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                })->render(),
                $filename,
                [
                    'Content-Type' => 'application/json',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                ]
            );
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Export news list as simple HTML report
     */
    public function newsHTML(Request $request)
    {
        try {
            $status = $request->get('status');
            $categoryId = $request->get('category_id');
            $writerId = $request->get('writer_id');

            $query = News::query();

            if (!empty($status)) {
                $query->status($status);
            }
            if (!empty($categoryId)) {
                $query->byCategory($categoryId);
            }
            if (!empty($writerId)) {
                $query->byWriter($writerId);
            }

            $newsList = $query->get();
            $exportDate = date('Y-m-d H:i:s');

            $html = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>News Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .header { background-color: #333; color: white; padding: 20px; border-radius: 5px; }
        .status-approved { background-color: #d4edda; }
        .status-pending { background-color: #fff3cd; }
        .status-draft { background-color: #e2e3e5; }
        .status-rejected { background-color: #f8d7da; }
    </style>
</head>
<body>
    <div class="header">
        <h1>News Report</h1>
        <p>Generated: {$exportDate}</p>
        <p>Total Items: {$newsList->count()}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Published</th>
                <th>Category</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>
HTML;

            foreach ($newsList as $news) {
                $statusClass = 'status-' . ($news->status ?? 'draft');
                $statusText = $news->status ?? 'draft';
                $published = $news->is_published ? 'Yes' : 'No';
                $categoryName = $news->category?->name ?? '-';
                $createdDate = $news->created_at->format('Y-m-d');
                $html .= <<<HTML
            <tr>
                <td>{$news->id}</td>
                <td>{$news->title}</td>
                <td>{$news->author}</td>
                <td><span class="{$statusClass}">{$statusText}</span></td>
                <td>{$published}</td>
                <td>{$categoryName}</td>
                <td>{$createdDate}</td>
            </tr>
HTML;
            }

            $html .= <<<HTML
        </tbody>
    </table>
</body>
</html>
HTML;

            $filename = 'news_' . date('Y-m-d_His') . '.html';

            return response()->make($html, 200, [
                'Content-Type' => 'text/html; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
