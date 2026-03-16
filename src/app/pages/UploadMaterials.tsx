import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Upload, FileText, FileAudio, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function UploadMaterials() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ name: string; type: string; size: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            toast.success('تم رفع الملفات بنجاح!');
            navigate('/dashboard/project-progress/PRJ-NEW');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">رفع المواد</h1>
        <p className="text-stone-600">قم برفع النصوص والملفات الصوتية الخاصة بالمشروع</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>رفع الملفات</CardTitle>
          <CardDescription>
            يمكنك رفع ملفات PDF، Word، أو ملفات نصية للنصوص، وملفات صوتية للمراجع
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-stone-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors">
            <Upload className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <Label
              htmlFor="file-upload"
              className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
            >
              اضغط لاختيار الملفات
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.mp3,.wav,.ogg"
            />
            <p className="text-sm text-stone-500 mt-2">
              أو اسحب الملفات وأفلتها هنا
            </p>
            <p className="text-xs text-stone-400 mt-1">
              PDF, DOC, TXT, MP3, WAV (بحد أقصى 50MB)
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">الملفات المرفوعة ({files.length})</h3>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200"
                >
                  <div className="flex items-center gap-3">
                    {file.type.includes('audio') ? (
                      <FileAudio className="h-5 w-5 text-purple-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-stone-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Notes */}
      <Card>
        <CardHeader>
          <CardTitle>ملاحظات وتعليمات</CardTitle>
          <CardDescription>أضف أي تعليمات أو ملاحظات خاصة للمؤدي الصوتي</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="مثال: يرجى التركيز على نبرة حماسية في الجزء الأول، واستخدام نبرة هادئة في الخاتمة..."
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">جاري رفع الملفات...</span>
                <span className="text-sm text-stone-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          disabled={uploading}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={files.length === 0 || uploading}
          className="bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <CheckCircle2 className="ml-2 h-4 w-4" />
          متابعة إلى مرحلة اختيار الصوت
        </Button>
      </div>
    </div>
  );
}
