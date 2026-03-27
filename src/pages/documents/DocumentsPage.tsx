import React, { useRef, useState } from "react";
import { FileText, Upload, Download, Trash2, Share2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

type DocStatus = "Draft" | "In Review" | "Signed";

type DocType = {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: DocStatus;
};

const initialDocs: DocType[] = [
  {
    id: 1,
    name: "Pitch Deck 2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2024-02-15",
    shared: true,
    status: "Draft",
  },
  {
    id: 2,
    name: "Financial Projections.xlsx",
    type: "Spreadsheet",
    size: "1.8 MB",
    lastModified: "2024-02-10",
    shared: false,
    status: "In Review",
  },
];

export const DocumentsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [documents, setDocuments] = useState<DocType[]>(initialDocs);
  const [previewFile, setPreviewFile] = useState<DocType | null>(null);

  const [openSign, setOpenSign] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  // =========================
  // 📂 UPLOAD DOCUMENT
  // =========================
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: DocType = {
      id: Date.now(),
      name: file.name,
      type: file.type.includes("pdf")
        ? "PDF"
        : file.type.includes("sheet")
        ? "Spreadsheet"
        : "Document",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      lastModified: new Date().toISOString().split("T")[0],
      shared: false,
      status: "Draft",
    };

    setDocuments((prev) => [...prev, newDoc]);
  };

  // =========================
  // 👁️ PREVIEW
  // =========================
  const handlePreview = (doc: DocType) => {
    setPreviewFile(doc);
  };

  // =========================
  // ✍️ SIGNATURE PAD
  // =========================
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 400, 200);
  };

  const saveSignature = () => {
    if (!selectedDocId) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDocId
          ? { ...doc, status: "Signed" }
          : doc
      )
    );

    setOpenSign(false);
    clearSignature();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">
            Manage your startup's important files
          </p>
        </div>

        {/* UPLOAD BUTTON */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />

        <Button
          leftIcon={<Upload size={18} />}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* STORAGE (UNCHANGED) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Storage</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium text-gray-900">12.5 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-primary-600 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available</span>
                <span className="font-medium text-gray-900">7.5 GB</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Recent Files
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Shared with Me
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Starred
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Trash
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* DOCUMENT CHAMBER */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Document Chamber (Deals & Contracts)
              </h2>
            </CardHeader>

            <CardBody className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg"
                >
                  <FileText className="mr-3 text-primary-600" />

                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>

                    <div className="flex gap-2 mt-1">
                      <Badge
                        variant={
                          doc.status === "Signed"
                            ? "success"
                            : doc.status === "In Review"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  </div>

                  {/* PREVIEW */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(doc)}
                  >
                    👁
                  </Button>

                  {/* SIGN */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setOpenSign(true);
                    }}
                  >
                    ✍️
                  </Button>

                  <Download size={16} className="ml-2" />
                  <Share2 size={16} className="ml-2" />
                  <Trash2 size={16} className="ml-2" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ================= SIGNATURE MODAL ================= */}
      {openSign && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="font-semibold mb-2">E-Sign Document</h2>

            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="border rounded"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
            />

            <div className="flex justify-between mt-3">
              <Button variant="outline" onClick={clearSignature}>
                Clear
              </Button>
              <Button onClick={saveSignature}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PREVIEW MODAL ================= */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="font-semibold">Preview</h2>
            <p className="mt-2">{previewFile.name}</p>

            <Button className="mt-3" onClick={() => setPreviewFile(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};