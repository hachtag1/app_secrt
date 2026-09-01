'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Pencil,
  Trash2,
  QrCode,
  Download,
  GraduationCap,
  Search,
  RefreshCw,
  Eye,
  ExternalLink,
  FileText,
  Upload,
  X,
  Settings,
} from 'lucide-react';
import PaymentCardPreview, { type Payment } from './PaymentCardPreview';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

interface FormState {
  reference: string;
  nomComplet: string;
  montant: string;
  moyenPaiement: string;
  datePaiement: string;
  numeroQuittance: string;
  statutPaiement: string;
  service: string;
  documentPath: string | null;
  documentName: string | null;
}

const emptyForm: FormState = {
  reference: '',
  nomComplet: '',
  montant: '',
  moyenPaiement: 'CAMPOST',
  datePaiement: '',
  numeroQuittance: '',
  statutPaiement: 'PAYE',
  service: '',
  documentPath: null,
  documentName: null,
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [qrDialogId, setQrDialogId] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewPayment, setPreviewPayment] = useState<Payment | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isAuth, setIsAuth] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les paiements', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/login');
    } else {
      setIsAuth(true);
      fetchPayments();
    }
  }, [fetchPayments, router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyan-700/20" />
          <p className="text-gray-400 text-sm">Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (file: File) => {
    const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/png','image/jpeg','image/webp'];
    if (!allowed.includes(file.type)) {
      toast({ title: 'Fichier non autorisé', description: 'Formats acceptés : PDF, Word, PNG, JPEG, WebP', variant: 'destructive' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Fichier trop lourd', description: 'Taille maximale : 10 Mo', variant: 'destructive' });
      return;
    }
    setUploadingDoc(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, documentPath: data.documentPath, documentName: data.documentName }));
        toast({ title: 'Document ajouté', description: data.documentName });
      } else {
        const err = await res.json();
        toast({ title: 'Erreur upload', description: err.error || 'Echec', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Upload échoué', variant: 'destructive' });
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.nomComplet || !form.montant || !form.service) {
      toast({ title: 'Champs requis', description: 'Nom, montant et service sont obligatoires', variant: 'destructive' });
      return;
    }

    try {
      const url = editingId ? `/api/payments/${editingId}` : '/api/payments';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast({ title: editingId ? 'Paiement modifié' : 'Paiement ajouté', description: 'Opération réussie' });
        setFormOpen(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchPayments();
      }
    } catch {
      toast({ title: 'Erreur', description: 'Opération échouée', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/payments/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Supprimé', description: 'Le paiement a été supprimé' });
        setDeleteId(null);
        fetchPayments();
      }
    } catch {
      toast({ title: 'Erreur', description: 'Suppression échouée', variant: 'destructive' });
    }
  };

  const handleEdit = (p: Payment) => {
    setEditingId(p.id);
    setForm({
      reference: p.reference,
      nomComplet: p.nomComplet,
      montant: p.montant,
      moyenPaiement: p.moyenPaiement,
      datePaiement: p.datePaiement,
      numeroQuittance: p.numeroQuittance,
      statutPaiement: p.statutPaiement,
      service: p.service,
      documentPath: p.documentPath,
      documentName: p.documentName,
    });
    setFormOpen(true);
  };

  const handleShowQr = async (id: string) => {
    setQrDialogId(id);
    setQrDataUrl(null);
    try {
      const res = await fetch(`/api/payments/${id}/qr`);
      if (res.ok) {
        const data = await res.json();
        setQrDataUrl(data.qrCode);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de générer le QR code', variant: 'destructive' });
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode_paiement_${qrDialogId?.slice(-4)}.png`;
    a.click();
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-700 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-cyan-800 text-lg block leading-tight">
                UNIVERSITE DE DSCHANG
              </span>
              <span className="text-xs text-gray-400">Panneau d'administration</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
              Administration
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-cyan-700"
              onClick={() => {
                setSettingsEmail(localStorage.getItem('adminEmail') || 'admin@univ-dschang.cm');
                setSettingsPassword(localStorage.getItem('adminPassword') || 'admin');
                setSettingsOpen(true);
              }}
            >
              <Settings className="h-4 w-4 mr-1" />
              Paramètres
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-red-600"
              onClick={() => {
                localStorage.removeItem('adminAuth');
                router.push('/login');
              }}
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
              <p className="text-gray-500 text-sm mt-1">
                Créez et gérez les paiements, générez les QR codes
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPayments}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Dialog open={formOpen} onOpenChange={(open) => {
                setFormOpen(open);
                if (!open) {
                  setEditingId(null);
                  setForm(emptyForm);
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-cyan-700 hover:bg-cyan-800 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau paiement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Modifier le paiement' : 'Nouveau paiement'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Référence (Optionnel)</Label>
                      <Input
                        id="reference"
                        value={form.reference}
                        onChange={(e) => setForm({ ...form, reference: e.target.value })}
                        placeholder="Ex: 2fa672f7-2185-46b5-9e90-5d8e731a79cc (Vide = auto-généré)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomComplet">Nom complet *</Label>
                      <Input
                        id="nomComplet"
                        value={form.nomComplet}
                        onChange={(e) => setForm({ ...form, nomComplet: e.target.value })}
                        placeholder="Ex: Eliane Noelle Zebaze Mahakou"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="montant">Montant *</Label>
                        <Input
                          id="montant"
                          value={form.montant}
                          onChange={(e) => setForm({ ...form, montant: e.target.value })}
                          placeholder="Ex: 25.000 XAF"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service">Service *</Label>
                        <Input
                          id="service"
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          placeholder="Ex: Authentification de diplôme"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="moyenPaiement">Moyen de paiement</Label>
                        <Select
                          value={form.moyenPaiement}
                          onValueChange={(v) => setForm({ ...form, moyenPaiement: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CAMPOST">CAMPOST</SelectItem>
                            <SelectItem value="MTN MoMo">MTN MoMo</SelectItem>
                            <SelectItem value="Orange Money">Orange Money</SelectItem>
                            <SelectItem value="Espèces">Espèces</SelectItem>
                            <SelectItem value="Virement">Virement bancaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statutPaiement">Statut</Label>
                        <Select
                          value={form.statutPaiement}
                          onValueChange={(v) => setForm({ ...form, statutPaiement: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PAYE">PAYE</SelectItem>
                            <SelectItem value="EN ATTENTE">EN ATTENTE</SelectItem>
                            <SelectItem value="ECHEC">ECHEC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="datePaiement">Date de paiement</Label>
                      <Input
                        id="datePaiement"
                        value={form.datePaiement}
                        onChange={(e) => setForm({ ...form, datePaiement: e.target.value })}
                        placeholder="Laisser vide pour la date actuelle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroQuittance">Numéro de Quittance</Label>
                      <Input
                        id="numeroQuittance"
                        value={form.numeroQuittance}
                        onChange={(e) => setForm({ ...form, numeroQuittance: e.target.value })}
                        placeholder="Ex: 04R23362202607"
                      />
                    </div>
                    {/* Upload accusé de paiement */}
                    <div className="space-y-2">
                      <Label>Accusé de paiement</Label>
                      {form.documentPath ? (
                        <div className="flex items-center gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                          <FileText className="h-5 w-5 text-cyan-700 shrink-0" />
                          <span className="text-sm text-cyan-800 truncate flex-1" title={form.documentName || undefined}>
                            {form.documentName}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-cyan-700 hover:text-red-500 shrink-0"
                            onClick={() => setForm((prev) => ({ ...prev, documentPath: null, documentName: null }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm text-gray-500">
                            {uploadingDoc ? 'Envoi en cours...' : 'Cliquez pour joindre le document'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">PDF, Word, PNG, JPEG, WebP (max 10 Mo)</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                          e.target.value = '';
                        }}
                      />
                    </div>
                    <Button
                      className="w-full bg-cyan-700 hover:bg-cyan-800 text-white"
                      onClick={handleSubmit}
                    >
                      {editingId ? 'Enregistrer les modifications' : 'Créer le paiement'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-cyan-700">{payments.length}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total paiements</p>
                  <p className="font-semibold text-gray-900">Enregistrés</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-700">
                    {payments.filter((p) => p.statutPaiement.toUpperCase() === 'PAYE').length}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payés</p>
                  <p className="font-semibold text-emerald-700">Confirmés</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-700">
                    {payments.filter((p) => p.statutPaiement.toUpperCase() !== 'PAYE').length}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">En attente / Echoués</p>
                  <p className="font-semibold text-amber-700">Non payés</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Rechercher par nom, référence, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg">Liste des paiements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Chargement...</div>
              ) : filteredPayments.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400 mb-2">Aucun paiement trouvé</p>
                  <p className="text-gray-300 text-sm">
                    {searchTerm
                      ? 'Essayez un autre terme de recherche'
                      : 'Cliquez sur "Nouveau paiement" pour commencer'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-4 sm:px-6">N°</TableHead>
                        <TableHead>Nom complet</TableHead>
                        <TableHead className="hidden sm:table-cell">Montant</TableHead>
                        <TableHead className="hidden md:table-cell">Service</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right px-4 sm:px-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="px-4 sm:px-6 font-mono text-xs text-gray-500">
                            #{p.id.slice(-4)}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {p.nomComplet}
                              {p.documentPath && (
                                <FileText className="h-3.5 w-3.5 text-cyan-600 shrink-0" title={p.documentName || 'Document attaché'} />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{p.montant}</TableCell>
                          <TableCell className="hidden md:table-cell text-gray-500">
                            {p.service}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                p.statutPaiement.toUpperCase() === 'PAYE'
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                  : p.statutPaiement.toUpperCase() === 'EN ATTENTE'
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                  : 'bg-red-100 text-red-700 hover:bg-red-100'
                              }`}
                            >
                              {p.statutPaiement}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-4 sm:px-6">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setPreviewPayment(p)}
                                title="Apercu apres scan"
                              >
                                <Eye className="h-4 w-4 text-cyan-700" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleShowQr(p.id)}
                                title="Voir QR Code"
                              >
                                <QrCode className="h-4 w-4 text-cyan-700" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(p)}
                                title="Modifier"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setDeleteId(p.id)}
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-gray-400 text-xs">
            &copy; Université de Dschang &mdash; Système de Gestion des Paiements
          </p>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le paiement sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog - Apercu apres scan */}
      <Dialog open={!!previewPayment} onOpenChange={(open) => !open && setPreviewPayment(null)}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-transparent border-0 shadow-2xl">
          <div className="bg-cyan-700 text-white px-5 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <DialogTitle className="text-sm font-semibold">
                Apercu : ce que verra l&apos;utilisateur apres le scan du QR code
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              {previewPayment && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-cyan-100 hover:text-white hover:bg-cyan-600"
                  onClick={() => {
                    setPreviewPayment(null);
                    router.push(`/details_paiement/${previewPayment.id}`);
                  }}
                >
                  <ExternalLink className="mr-1.5 h-3 w-3" />
                  Ouvrir dans un nouvel onglet
                </Button>
              )}
            </div>
          </div>
          {previewPayment && (
            <PaymentCardPreview
              payment={previewPayment}
              onClose={() => setPreviewPayment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!qrDialogId} onOpenChange={(open) => !open && setQrDialogId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code du paiement</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrDataUrl ? (
              <>
                <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 rounded-lg" />
                <p className="text-xs text-gray-400 text-center">
                  Scannez ce code pour accéder aux détails du paiement
                </p>
                <Button
                  className="bg-cyan-700 hover:bg-cyan-800 text-white w-full"
                  onClick={downloadQr}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le QR Code
                </Button>
              </>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <p className="text-gray-400 text-sm">Génération en cours...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Paramètres du compte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email de connexion</Label>
              <Input 
                value={settingsEmail} 
                onChange={(e) => setSettingsEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <Input 
                type="text"
                value={settingsPassword} 
                onChange={(e) => setSettingsPassword(e.target.value)} 
              />
            </div>
            <Button
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white mt-2"
              onClick={() => {
                localStorage.setItem('adminEmail', settingsEmail);
                localStorage.setItem('adminPassword', settingsPassword);
                toast({ title: 'Succès', description: 'Identifiants mis à jour' });
                setSettingsOpen(false);
              }}
            >
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
