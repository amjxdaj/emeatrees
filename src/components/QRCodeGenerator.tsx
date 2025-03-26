
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  title?: string;
}

const QRCodeGenerator = ({ url, size = 200, title }: QRCodeGeneratorProps) => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    
    if (svg) {
      // Create a Blob from the SVG content
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      
      // Create download URL
      const url = URL.createObjectURL(svgBlob);
      setDownloadUrl(url);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `tree-qr-code-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <QRCodeSVG
            id="qr-code-svg"
            value={url}
            size={size}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
        
        <div className="mt-4 w-full">
          <Button onClick={handleDownload} variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Scan this QR code to view tree details
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
