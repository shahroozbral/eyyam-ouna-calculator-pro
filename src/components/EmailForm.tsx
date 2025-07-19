import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Upload, Send, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface EmailFormProps {
  onClose: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleScreenshotCapture = () => {
    // Capture screenshot of the current page
    html2canvas(document.body).then(canvas => {
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          setScreenshot(file);
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create email content
      const emailSubject = `گزارش ایراد برنامه محاسبه ایام عونا - ${name}`;
      const emailBody = `
گزارش ایراد برنامه:

نام: ${name}
شرح ایراد: ${description}

ارسال شده در تاریخ: ${new Date().toLocaleDateString('fa-IR')}
      `;

      // Create mailto link
      const mailtoLink = `mailto:shahroozbral@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center p-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">پیام شما ارسال شد</h3>
          <p className="text-muted-foreground">برنامه ایمیل شما باز شده است. لطفاً ایمیل را ارسال کنید.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg text-primary">
          <Mail className="w-6 h-6" />
          گزارش ایراد برنامه
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">
              نام (اختیاری)
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام خود را وارد کنید"
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">
              شرح ایراد *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="لطفاً ایراد موجود در برنامه را به تفصیل شرح دهید..."
              required
              rows={5}
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">
              اسکرین شات (اختیاری)
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleScreenshotCapture}
                className="flex-1"
              >
                <Upload className="w-4 h-4 ml-2" />
                گرفتن اسکرین شات
              </Button>
            </div>
            {screenshot && (
              <p className="text-sm text-green-600 mt-2">
                اسکرین شات آماده شد ✓
              </p>
            )}
          </div>

          <Alert>
            <AlertDescription>
              با کلیک بر روی "ارسال گزارش"، برنامه ایمیل شما باز خواهد شد و می‌توانید گزارش خود را به shahroozbral@gmail.com ارسال کنید.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!description.trim() || isSubmitting}
              className="flex-1"
            >
              <Send className="w-4 h-4 ml-2" />
              {isSubmitting ? 'در حال ارسال...' : 'ارسال گزارش'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              لغو
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailForm;