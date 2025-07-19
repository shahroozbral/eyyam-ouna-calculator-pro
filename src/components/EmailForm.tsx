import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Camera, Send, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface EmailFormProps {
  onClose: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Capture screenshot automatically
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Convert canvas to blob
      const screenshotBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Convert screenshot to base64 for email attachment simulation
      const screenshotDataUrl = canvas.toDataURL('image/png');
      
      // Create a FormData to send to your backend (if you have one)
      // For now, we'll simulate sending through a service
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('screenshot', screenshotBlob, 'screenshot.png');
      formData.append('timestamp', new Date().toISOString());

      // Simulate email sending (replace with actual email service)
      const emailData = {
        to: 'shahroozbral@gmail.com',
        subject: `گزارش ایراد برنامه محاسبه ایام عونا - ${name || 'کاربر'}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif;">
            <h2>گزارش ایراد برنامه محاسبه ایام عونا</h2>
            <p><strong>نام:</strong> ${name || 'نامشخص'}</p>
            <p><strong>شرح ایراد:</strong></p>
            <p>${description}</p>
            <p><strong>تاریخ ارسال:</strong> ${new Date().toLocaleDateString('fa-IR')}</p>
            <p><strong>زمان ارسال:</strong> ${new Date().toLocaleTimeString('fa-IR')}</p>
            <p><em>اسکرین شات صفحه به عنوان ضمیمه ارسال شده است.</em></p>
          </div>
        `,
        attachments: [{
          filename: 'screenshot.png',
          content: screenshotDataUrl.split(',')[1],
          encoding: 'base64'
        }]
      };

      // In a real implementation, you would send this to your backend
      // For now, we'll just log it and show success
      console.log('Email would be sent with data:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('خطا در ارسال گزارش رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center p-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">گزارش شما ارسال شد</h3>
          <p className="text-muted-foreground">
            گزارش ایراد شما همراه با اسکرین شات با موفقیت ارسال شد. 
            به زودی بررسی و پاسخ داده خواهد شد.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
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

          <Alert>
            <Camera className="h-4 w-4" />
            <AlertDescription>
              با کلیک بر روی "ارسال گزارش"، اسکرین شات صفحه به طور خودکار گرفته شده و همراه با گزارش به shahroozbral@gmail.com ارسال خواهد شد.
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