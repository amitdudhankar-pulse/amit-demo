@echo off
REM Replace '.' with your root folder if needed, e.g. set ROOT=src
set ROOT=src

REM Main folders
mkdir "%ROOT%\lib\directus\fields"
mkdir "%ROOT%\lib\directus\schemas\shared"
mkdir "%ROOT%\lib\directus\fetch"

REM Files in directus
type nul > "%ROOT%\lib\directus\client.ts"
type nul > "%ROOT%\lib\directus\fields\products.ts"
type nul > "%ROOT%\lib\directus\fields\categories.ts"
type nul > "%ROOT%\lib\directus\fields\functions.ts"
type nul > "%ROOT%\lib\directus\fields\blogs.ts"
type nul > "%ROOT%\lib\directus\fields\news.ts"
type nul > "%ROOT%\lib\directus\fields\config.ts"
type nul > "%ROOT%\lib\directus\fields\reviews.ts"
type nul > "%ROOT%\lib\directus\fields\bookmarks.ts"
type nul > "%ROOT%\lib\directus\schemas\product.ts"
type nul > "%ROOT%\lib\directus\schemas\category.ts"
type nul > "%ROOT%\lib\directus\schemas\function.ts"
type nul > "%ROOT%\lib\directus\schemas\blog.ts"
type nul > "%ROOT%\lib\directus\schemas\news.ts"
type nul > "%ROOT%\lib\directus\schemas\config.ts"
type nul > "%ROOT%\lib\directus\schemas\review.ts"
type nul > "%ROOT%\lib\directus\schemas\bookmark.ts"
type nul > "%ROOT%\lib\directus\schemas\shared\file.ts"
type nul > "%ROOT%\lib\directus\schemas\shared\FAQ.ts"
type nul > "%ROOT%\lib\directus\schemas\shared\date.ts"
type nul > "%ROOT%\lib\directus\schemas\shared\boolean.ts"
type nul > "%ROOT%\lib\directus\schemas\shared\tags.ts"
type nul > "%ROOT%\lib\directus\fetch\products.ts"
type nul > "%ROOT%\lib\directus\fetch\categories.ts"
type nul > "%ROOT%\lib\directus\fetch\functions.ts"
type nul > "%ROOT%\lib\directus\fetch\blogs.ts"
type nul > "%ROOT%\lib\directus\fetch\news.ts"
type nul > "%ROOT%\lib\directus\fetch\config.ts"
type nul > "%ROOT%\lib\directus\fetch\reviews.ts"
type nul > "%ROOT%\lib\directus\fetch\bookmarks.ts"
type nul > "%ROOT%\lib\cms.ts"

REM Example structure for 'src/lib/lib.ts'
mkdir "%ROOT%\src\lib"
type nul > "%ROOT%\src\lib\lib.ts"

echo Folder structure created successfully!
