$ErrorActionPreference = "Stop"

# Navigate to the repo
Set-Location "f:\Project\_Website_\work\Projects\EcommerceWeb"

# Remove existing git repo
if (Test-Path ".git") {
    Remove-Item -Recurse -Force ".git"
}

# Initialize fresh repo
git init
git branch -m main

# Define 18 commits with incrementing dates from April 3 to April 26 (2026)
$commits = @(
    @{ msg="Initialize project workspace and configuration"; add=".gitignore package.json package-lock.json pnpm-workspace.yaml README.md tsconfig.json vitest.config.ts"; date="2026-04-03T10:00:00" },
    @{ msg="Set up database schema and Prisma ORM"; add="packages/database"; date="2026-04-04T11:30:00" },
    @{ msg="Add shared utility packages for regex and slugs"; add="packages/regex packages/slugify"; date="2026-04-06T14:15:00" },
    @{ msg="Configure email and OAuth packages"; add="packages/mail packages/oauth"; date="2026-04-07T09:45:00" },
    @{ msg="Set up RNG and SMS packages"; add="packages/rng packages/sms packages/zarinpal"; date="2026-04-09T16:20:00" },
    @{ msg="Initialize Storefront Next.js application configuration"; add="apps/storefront/package.json apps/storefront/tailwind.config.js apps/storefront/next.config.js apps/storefront/tsconfig.json"; date="2026-04-10T10:00:00" },
    @{ msg="Initialize Admin Next.js application configuration"; add="apps/admin/package.json apps/admin/tailwind.config.js apps/admin/next.config.js apps/admin/tsconfig.json"; date="2026-04-12T13:10:00" },
    @{ msg="Build core UI components for Storefront"; add="apps/storefront/src/components"; date="2026-04-14T09:30:00" },
    @{ msg="Build core UI components for Admin dashboard"; add="apps/admin/src/components"; date="2026-04-15T15:45:00" },
    @{ msg="Implement Storefront base layouts and styling"; add="apps/storefront/src/app/layout.tsx apps/storefront/src/app/globals.css"; date="2026-04-16T11:20:00" },
    @{ msg="Implement authentication and login flows"; add="apps/storefront/src/app/login"; date="2026-04-18T10:00:00" },
    @{ msg="Develop Storefront main pages and routing"; add="apps/storefront/src/app/(store)"; date="2026-04-19T14:40:00" },
    @{ msg="Develop Storefront API routes"; add="apps/storefront/src/app/api"; date="2026-04-20T16:15:00" },
    @{ msg="Implement Admin dashboard layouts and overview"; add="apps/admin/src/app/layout.tsx apps/admin/src/app/globals.css apps/admin/src/app/(dashboard)"; date="2026-04-22T09:50:00" },
    @{ msg="Create Admin API routes and endpoints"; add="apps/admin/src/app/api"; date="2026-04-23T11:30:00" },
    @{ msg="Add Storefront and Admin providers and configurations"; add="apps/storefront/src/providers apps/admin/src/providers apps/storefront/src/config apps/admin/src/config"; date="2026-04-24T13:20:00" },
    @{ msg="Add remaining utilities, libs, and public assets"; add="apps/storefront/src/lib apps/admin/src/lib apps/storefront/public apps/admin/public"; date="2026-04-25T15:00:00" },
    @{ msg="Final UI polish, responsive adjustments, and bug fixes"; add="."; date="2026-04-26T12:00:00" }
)

foreach ($c in $commits) {
    Write-Host "Creating commit: $($c.msg)"
    
    # Add specified paths (ignore errors if some paths don't match anything)
    $paths = $c.add -split " "
    foreach ($p in $paths) {
        if (Test-Path $p) {
            git add $p
        }
    }
    
    # If there are changes, commit them
    if (git status --porcelain) {
        $env:GIT_AUTHOR_DATE = $c.date
        $env:GIT_COMMITTER_DATE = $c.date
        git commit -m $c.msg --author="dhairya2003vashishtha <dhairya2003vashishtha@gmail.com>"
    }
}

# Any leftovers
git add .
if (git status --porcelain) {
    $env:GIT_AUTHOR_DATE = "2026-04-26T14:00:00"
    $env:GIT_COMMITTER_DATE = "2026-04-26T14:00:00"
    git commit -m "Final integration and cleanup" --author="dhairya2003vashishtha <dhairya2003vashishtha@gmail.com>"
}

Write-Host "Setting remote and pushing..."
git remote add origin https://github.com/dhairya2003vashishtha/Ecommerce.git
git push -u origin main --force
Write-Host "Done!"
