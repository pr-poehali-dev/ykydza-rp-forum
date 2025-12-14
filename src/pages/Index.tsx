import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  section: 'rules' | 'support' | 'news';
  timestamp: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
  status?: 'active' | 'banned';
}

interface User {
  id: number;
  name: string;
  status: 'active' | 'banned';
  posts: number;
}

const Index = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'rules' | 'support' | 'news' | 'admin'>('news');
  const [isAdmin] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [adminAction, setAdminAction] = useState<'ban' | 'delete' | 'filter' | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'Основные правила сервера Ykydza RP',
      content: 'Добро пожаловать на наш сервер! Здесь вы найдете все основные правила для комфортной игры...',
      author: 'Администратор',
      section: 'rules',
      timestamp: '2 дня назад',
      likes: 156,
      comments: 23,
      isPinned: true,
      status: 'active'
    },
    {
      id: 2,
      title: 'Обновление 2.5 - Новые локации!',
      content: 'Мы рады сообщить о выходе крупного обновления! Добавлены новые районы города, улучшена графика...',
      author: 'DevTeam',
      section: 'news',
      timestamp: '5 часов назад',
      likes: 342,
      comments: 89,
      isPinned: true,
      status: 'active'
    },
    {
      id: 3,
      title: 'Не могу зайти на сервер',
      content: 'Помогите пожалуйста, при подключении выдает ошибку...',
      author: 'Player123',
      section: 'support',
      timestamp: '1 час назад',
      likes: 12,
      comments: 5,
      status: 'active'
    }
  ]);

  const [users] = useState<User[]>([
    { id: 1, name: 'Player123', status: 'active', posts: 45 },
    { id: 2, name: 'GamerPro', status: 'active', posts: 78 },
    { id: 3, name: 'Спамер2024', status: 'banned', posts: 12 }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    section: 'news' as 'rules' | 'support' | 'news'
  });

  const handleCreatePost = () => {
    const post: Post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: 'Администратор',
      section: newPost.section,
      timestamp: 'только что',
      likes: 0,
      comments: 0,
      status: 'active'
    };
    
    setPosts([post, ...posts]);
    setCreatePostOpen(false);
    setNewPost({ title: '', content: '', section: 'news' });
    
    toast({
      title: '✅ Пост опубликован',
      description: 'Ваш пост успешно добавлен на форум'
    });
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
    setAdminAction(null);
    setSelectedPost(null);
    toast({
      title: '🗑️ Пост удален',
      description: 'Пост был успешно удален с форума'
    });
  };

  const handleBanUser = () => {
    toast({
      title: '🚫 Пользователь заблокирован',
      description: 'Пользователь больше не может создавать посты',
      variant: 'destructive'
    });
    setAdminAction(null);
  };

  const filteredPosts = posts.filter(p => p.section === activeSection);

  const getSectionIcon = (section: string) => {
    switch(section) {
      case 'rules': return 'ShieldCheck';
      case 'support': return 'HeadphonesIcon';
      case 'news': return 'Newspaper';
      case 'admin': return 'Settings';
      default: return 'MessageSquare';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary h-1 w-full" />
      
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Icon name="Gamepad2" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#0EA5E9] to-[#D946EF] bg-clip-text text-transparent">
                  Ykydza RP
                </h1>
                <p className="text-sm text-muted-foreground">Официальный форум</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Badge className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] border-0">
                  <Icon name="Crown" size={14} className="mr-1" />
                  Администратор
                </Badge>
              )}
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  A
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as any)} className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="news" className="gap-2">
                <Icon name={getSectionIcon('news')} size={18} />
                Новости
              </TabsTrigger>
              <TabsTrigger value="rules" className="gap-2">
                <Icon name={getSectionIcon('rules')} size={18} />
                Правила
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2">
                <Icon name={getSectionIcon('support')} size={18} />
                Поддержка
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin" className="gap-2">
                  <Icon name={getSectionIcon('admin')} size={18} />
                  Управление
                </TabsTrigger>
              )}
            </TabsList>

            {isAdmin && activeSection !== 'admin' && (
              <Button 
                onClick={() => setCreatePostOpen(true)}
                className="gradient-primary hover:opacity-90 transition-opacity gap-2"
              >
                <Icon name="Plus" size={18} />
                Создать пост
              </Button>
            )}
          </div>

          <TabsContent value="news" className="space-y-4 animate-fade-in">
            {filteredPosts.length === 0 ? (
              <Card className="border-border/50 gradient-card">
                <CardContent className="py-12 text-center">
                  <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Пока нет постов в этом разделе</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 gradient-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.isPinned && (
                            <Badge variant="secondary" className="gap-1">
                              <Icon name="Pin" size={12} />
                              Закреплено
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={14} />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {post.timestamp}
                          </span>
                        </CardDescription>
                      </div>
                      
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedPost(post);
                            setAdminAction('delete');
                          }}
                          className="hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Icon name="ThumbsUp" size={16} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-secondary transition-colors">
                        <Icon name="MessageSquare" size={16} />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-accent transition-colors">
                        <Icon name="Share2" size={16} />
                        Поделиться
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="rules" className="space-y-4 animate-fade-in">
            {filteredPosts.length === 0 ? (
              <Card className="border-border/50 gradient-card">
                <CardContent className="py-12 text-center">
                  <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Пока нет постов в этом разделе</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 gradient-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.isPinned && (
                            <Badge variant="secondary" className="gap-1">
                              <Icon name="Pin" size={12} />
                              Закреплено
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={14} />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {post.timestamp}
                          </span>
                        </CardDescription>
                      </div>
                      
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedPost(post);
                            setAdminAction('delete');
                          }}
                          className="hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Icon name="ThumbsUp" size={16} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-secondary transition-colors">
                        <Icon name="MessageSquare" size={16} />
                        {post.comments}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="support" className="space-y-4 animate-fade-in">
            {filteredPosts.length === 0 ? (
              <Card className="border-border/50 gradient-card">
                <CardContent className="py-12 text-center">
                  <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Пока нет постов в этом разделе</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 gradient-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={14} />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {post.timestamp}
                          </span>
                        </CardDescription>
                      </div>
                      
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedPost(post);
                            setAdminAction('delete');
                          }}
                          className="hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Icon name="ThumbsUp" size={16} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-secondary transition-colors">
                        <Icon name="MessageSquare" size={16} />
                        {post.comments}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6 animate-fade-in">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-primary/50 gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="FileText" size={20} className="text-primary" />
                      Управление постами
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Создавайте, редактируйте и удаляйте посты во всех разделах форума
                    </p>
                    <Button 
                      className="w-full gradient-primary hover:opacity-90"
                      onClick={() => setCreatePostOpen(true)}
                    >
                      <Icon name="Plus" size={18} className="mr-2" />
                      Создать пост
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50 gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="UserX" size={20} className="text-destructive" />
                      Бан пользователей
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Блокируйте нарушителей и управляйте списком забаненных
                    </p>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => setAdminAction('ban')}
                    >
                      <Icon name="Ban" size={18} className="mr-2" />
                      Список банов
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-secondary/50 gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Filter" size={20} className="text-secondary" />
                      Фильтр контента
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Настройте автоматическую модерацию и фильтры запрещенных слов
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-secondary hover:bg-secondary/20"
                      onClick={() => setAdminAction('filter')}
                    >
                      <Icon name="Settings" size={18} className="mr-2" />
                      Настроить фильтры
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/50 gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Users" size={20} />
                    Пользователи форума
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.posts} постов</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {user.status === 'banned' ? (
                            <Badge variant="destructive" className="gap-1">
                              <Icon name="Ban" size={12} />
                              Забанен
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <Icon name="Check" size={12} />
                              Активен
                            </Badge>
                          )}
                          
                          {user.status === 'active' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-destructive/20 hover:text-destructive"
                              onClick={() => {
                                setAdminAction('ban');
                              }}
                            >
                              <Icon name="UserX" size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Plus" size={20} />
              Создать новый пост
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о посте и выберите раздел для публикации
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section">Раздел</Label>
              <Select 
                value={newPost.section} 
                onValueChange={(v) => setNewPost({...newPost, section: v as any})}
              >
                <SelectTrigger id="section">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">
                    <div className="flex items-center gap-2">
                      <Icon name="Newspaper" size={16} />
                      Новости
                    </div>
                  </SelectItem>
                  <SelectItem value="rules">
                    <div className="flex items-center gap-2">
                      <Icon name="ShieldCheck" size={16} />
                      Правила
                    </div>
                  </SelectItem>
                  <SelectItem value="support">
                    <div className="flex items-center gap-2">
                      <Icon name="HeadphonesIcon" size={16} />
                      Поддержка
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input 
                id="title"
                placeholder="Введите заголовок поста..."
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Содержание</Label>
              <Textarea 
                id="content"
                placeholder="Введите текст поста..."
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePostOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleCreatePost}
              disabled={!newPost.title || !newPost.content}
              className="gradient-primary hover:opacity-90"
            >
              <Icon name="Send" size={16} className="mr-2" />
              Опубликовать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adminAction === 'delete'} onOpenChange={() => setAdminAction(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Icon name="AlertTriangle" size={20} />
              Удалить пост?
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить пост "{selectedPost?.title}"? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminAction(null)}>
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedPost && handleDeletePost(selectedPost.id)}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adminAction === 'ban'} onOpenChange={() => setAdminAction(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Ban" size={20} />
              Заблокировать пользователя
            </DialogTitle>
            <DialogDescription>
              Заблокированный пользователь не сможет создавать посты и комментарии
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Причина блокировки</Label>
              <Textarea 
                id="reason"
                placeholder="Укажите причину бана..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Длительность</Label>
              <Select defaultValue="permanent">
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1day">1 день</SelectItem>
                  <SelectItem value="7days">7 дней</SelectItem>
                  <SelectItem value="30days">30 дней</SelectItem>
                  <SelectItem value="permanent">Навсегда</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminAction(null)}>
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={handleBanUser}
            >
              <Icon name="UserX" size={16} className="mr-2" />
              Заблокировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adminAction === 'filter'} onOpenChange={() => setAdminAction(null)}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Filter" size={20} />
              Настройка фильтров контента
            </DialogTitle>
            <DialogDescription>
              Добавьте запрещенные слова и настройте автоматическую модерацию
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="banned-words">Запрещенные слова (через запятую)</Label>
              <Textarea 
                id="banned-words"
                placeholder="спам, мат, реклама..."
                rows={4}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Автоматическое удаление</p>
                <p className="text-sm text-muted-foreground">Удалять посты с запрещенными словами</p>
              </div>
              <Button variant="outline" size="sm">
                Включить
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Предупреждения</p>
                <p className="text-sm text-muted-foreground">Отправлять предупреждения пользователям</p>
              </div>
              <Button variant="outline" size="sm">
                Включить
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminAction(null)}>
              Отмена
            </Button>
            <Button 
              className="gradient-primary hover:opacity-90"
              onClick={() => {
                toast({
                  title: '✅ Фильтры обновлены',
                  description: 'Настройки модерации успешно сохранены'
                });
                setAdminAction(null);
              }}
            >
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
