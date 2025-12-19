<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;

class EmailNotificationService
{
    /**
     * Send news approval notification to writer
     */
    public static function sendApprovalNotification($news, $approvedBy)
    {
        try {
            $writerEmail = $news->writer?->email ?? $news->author_email;

            if (!$writerEmail) {
                return false;
            }

            $approverName = $approvedBy->name ?? 'Admin';

            $subject = "Your news '{$news->title}' has been approved";
            $message = <<<MSG
Dear Writer,

Your news article has been approved!

**Article Details:**
- Title: {$news->title}
- Approved by: {$approverName}
- Approved at: {$news->approved_at->format('Y-m-d H:i:s')}

You can now publish it to the public. Visit your dashboard to manage your article.

Best regards,
Admin Team
MSG;

            Mail::raw($message, function ($mail) use ($writerEmail, $subject) {
                $mail->to($writerEmail)
                     ->subject($subject)
                     ->from(config('mail.from.address'), config('mail.from.name'));
            });

            return true;
        } catch (\Exception $e) {
            \Log::error('Email notification failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send news rejection notification to writer
     */
    public static function sendRejectionNotification($news, $rejectedBy, $reason)
    {
        try {
            $writerEmail = $news->writer?->email ?? $news->author_email;

            if (!$writerEmail) {
                return false;
            }

            $rejectedByName = $rejectedBy->name ?? 'Admin';

            $subject = "Your news '{$news->title}' needs revision";
            $message = <<<MSG
Dear Writer,

Your news article has been reviewed and requires revisions.

**Article Details:**
- Title: {$news->title}
- Rejected by: {$rejectedByName}
- Reason: {$reason}

Please review the feedback and make the necessary changes. You can resubmit your article for review.

Best regards,
Admin Team
MSG;

            Mail::raw($message, function ($mail) use ($writerEmail, $subject) {
                $mail->to($writerEmail)
                     ->subject($subject)
                     ->from(config('mail.from.address'), config('mail.from.name'));
            });

            return true;
        } catch (\Exception $e) {
            \Log::error('Email notification failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send scheduled publish notification
     */
    public static function sendScheduledPublishNotification($news)
    {
        try {
            $writerEmail = $news->writer?->email ?? $news->author_email;

            if (!$writerEmail) {
                return false;
            }

            $subject = "Your news '{$news->title}' has been published";
            $message = <<<MSG
Dear Writer,

Your scheduled news article is now live!

**Article Details:**
- Title: {$news->title}
- Published at: {$news->published_at->format('Y-m-d H:i:s')}
- View: {config('app.url')}/news/{$news->slug}

Thank you for your contribution.

Best regards,
Admin Team
MSG;

            Mail::raw($message, function ($mail) use ($writerEmail, $subject) {
                $mail->to($writerEmail)
                     ->subject($subject)
                     ->from(config('mail.from.address'), config('mail.from.name'));
            });

            return true;
        } catch (\Exception $e) {
            \Log::error('Email notification failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send user account creation notification
     */
    public static function sendAccountCreatedNotification($user, $password, $role)
    {
        try {
            $subject = 'Your account has been created';
            $message = <<<MSG
Dear {$user->name},

Your {$role} account has been created successfully!

**Account Details:**
- Email: {$user->email}
- Password: {$password}
- Role: {$role}

Please log in at {config('app.url')}/login and change your password immediately.

Best regards,
Admin Team
MSG;

            Mail::raw($message, function ($mail) use ($user, $subject) {
                $mail->to($user->email)
                     ->subject($subject)
                     ->from(config('mail.from.address'), config('mail.from.name'));
            });

            return true;
        } catch (\Exception $e) {
            \Log::error('Email notification failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send user deletion notification
     */
    public static function sendAccountDeletedNotification($user, $email)
    {
        try {
            $subject = 'Your account has been deleted';
            $message = <<<MSG
Dear {$user->name},

Your account has been deleted from the system.

If you believe this was done in error, please contact the administrator.

Best regards,
Admin Team
MSG;

            Mail::raw($message, function ($mail) use ($email, $subject) {
                $mail->to($email)
                     ->subject($subject)
                     ->from(config('mail.from.address'), config('mail.from.name'));
            });

            return true;
        } catch (\Exception $e) {
            \Log::error('Email notification failed: ' . $e->getMessage());
            return false;
        }
    }
}
