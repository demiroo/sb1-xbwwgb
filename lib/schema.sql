-- Update RLS policies for user_profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.user_profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Update RLS policies for quotes
DROP POLICY IF EXISTS "Quotes are viewable by everyone" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated users can create quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete own quotes" ON public.quotes;

CREATE POLICY "Quotes are viewable by everyone"
    ON public.quotes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create quotes"
    ON public.quotes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own quotes"
    ON public.quotes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotes"
    ON public.quotes FOR DELETE
    USING (auth.uid() = user_id);

-- Update RLS policies for quote interactions
DROP POLICY IF EXISTS "Quote interactions are viewable by everyone" ON public.quote_likes;
DROP POLICY IF EXISTS "Authenticated users can manage likes" ON public.quote_likes;

CREATE POLICY "Quote interactions are viewable by everyone"
    ON public.quote_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage likes"
    ON public.quote_likes FOR ALL
    USING (auth.role() = 'authenticated');

-- Update RLS policies for bookmarks
DROP POLICY IF EXISTS "Quote bookmarks are viewable by everyone" ON public.quote_bookmarks;
DROP POLICY IF EXISTS "Authenticated users can manage bookmarks" ON public.quote_bookmarks;

CREATE POLICY "Quote bookmarks are viewable by everyone"
    ON public.quote_bookmarks FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage bookmarks"
    ON public.quote_bookmarks FOR ALL
    USING (auth.role() = 'authenticated');

-- Update RLS policies for comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

CREATE POLICY "Comments are viewable by everyone"
    ON public.comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

-- Update RLS policies for categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;

CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;