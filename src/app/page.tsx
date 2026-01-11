'use client';

import { useState } from 'react';
import { useAccountStore, Account } from '@/store/accountStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Plus, Share2, Upload, Download, Eye, EyeOff, Copy, Trash2, Edit, Lock } from 'lucide-react';

export default function PasswordManager() {
  const { accounts, addAccount, updateAccount, deleteAccount, exportAccounts, importAccounts } = useAccountStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBackupSheetOpen, setIsBackupSheetOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    url: '',
    username: '',
    password: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({ url: '', username: '', password: '', notes: '' });
    setEditingAccount(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || !formData.username || !formData.password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Harap isi URL, username, dan password',
      });
      return;
    }

    if (editingAccount) {
      updateAccount(editingAccount.id, formData);
      toast({
        title: 'Berhasil',
        description: 'Akun berhasil diperbarui',
      });
    } else {
      addAccount(formData);
      toast({
        title: 'Berhasil',
        description: 'Akun baru berhasil ditambahkan',
      });
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      url: account.url,
      username: account.username,
      password: account.password,
      notes: account.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAccount(id);
    toast({
      title: 'Berhasil',
      description: 'Akun berhasil dihapus',
    });
  };

  const handleShareWhatsApp = (account: Account) => {
    const message = `🔐 *Detail Akun*\n\n📌 *URL:* ${account.url}\n👤 *Username:* ${account.username}\n🔑 *Password:* ${account.password}\n\nDikirim dari Password Manager App`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: 'Berhasil',
      description: 'Password berhasil disalin ke clipboard',
    });
  };

  const handleBackup = () => {
    const data = exportAccounts();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Berhasil',
      description: 'Backup berhasil didownload',
    });
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      const success = importAccounts(data);
      if (success) {
        toast({
          title: 'Berhasil',
          description: 'Data berhasil di-restore',
        });
        setIsBackupSheetOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Format file tidak valid',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
      useAccountStore.getState().clearAll();
      toast({
        title: 'Berhasil',
        description: 'Semua data berhasil dihapus',
      });
      setIsBackupSheetOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Password Manager
            </h1>
          </div>
          <Sheet open={isBackupSheetOpen} onOpenChange={setIsBackupSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Upload className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild>
              <Button variant="outline" className="hidden md:flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Backup & Restore</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Backup & Restore</SheetTitle>
                <SheetDescription>
                  Kelola data akun Anda dengan fitur backup dan restore
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Backup Data</Label>
                  <Button onClick={handleBackup} className="w-full" variant="default">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download semua data akun dalam format JSON
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Restore Data</Label>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleRestore}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload file backup JSON untuk restore data
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-destructive">Danger Zone</Label>
                  <Button
                    onClick={handleClearAll}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Semua Data
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Akun
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{accounts.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Aman Tersimpan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {accounts.length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Terakhir Diupdate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">
                  {accounts.length > 0
                    ? new Date(
                        Math.max(...accounts.map((a) => new Date(a.updatedAt).getTime()))
                      ).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Daftar Akun</h2>
            {accounts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Lock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Belum ada akun yang tersimpan
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Akun Pertama
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <Card key={account.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">
                              {account.url}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {account.username}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(account)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(account.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground w-20">
                            Password:
                          </Label>
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              type={showPasswords[account.id] ? 'text' : 'password'}
                              value={account.password}
                              readOnly
                              className="font-mono text-sm"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => togglePasswordVisibility(account.id)}
                            >
                              {showPasswords[account.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyPassword(account.password)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {account.notes && (
                          <div className="text-sm text-muted-foreground">
                            <Label className="text-sm">Catatan:</Label>
                            <p className="mt-1">{account.notes}</p>
                          </div>
                        )}
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => handleShareWhatsApp(account)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Kirim ke WhatsApp
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <div className="fixed bottom-6 right-6 md:hidden">
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg h-14 w-14">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
        </div>

        {/* Add/Edit Dialog */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingAccount
                ? 'Perbarui detail akun yang tersimpan'
                : 'Simpan akun baru ke Password Manager'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL Halaman *</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="Email atau username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Catatan tambahan..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                {editingAccount ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Button for Desktop */}
      <div className="hidden md:block fixed bottom-6 right-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Tambah Akun
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingAccount
                  ? 'Perbarui detail akun yang tersimpan'
                  : 'Simpan akun baru ke Password Manager'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL Halaman *</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="Email atau username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan tambahan..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  {editingAccount ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
