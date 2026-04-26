$ErrorActionPreference = "Stop"

$messages = @(
    "Project initialization and setup",
    "Core infrastructure and components setup",
    "Database schemas and API routes",
    "Frontend UI and layouts implementation",
    "User profile and checkout address picker",
    "Payment integration and order processing",
    "Admin dashboard and product management",
    "Bug fixes and aesthetic refinements",
    "Security audit and authorization enhancements",
    "Final beta release preparations"
)

$commits = git log --reverse --format="%H" main
if ($commits.Length -eq 0) {
    Write-Host "No commits found."
    exit
}

Write-Host "Found $($commits.Length) commits."

# Start from the first commit
git checkout $commits[0]
git checkout -b new_main
git commit --amend -m $messages[0] --author="dhairya2003vashishtha <dhairya2003vashishtha@gmail.com>"

for ($i = 1; $i -lt $commits.Length; $i++) {
    $c = $commits[$i]
    Write-Host "Processing commit $($i + 1)/$($commits.Length): $c"
    
    # Cherry pick will apply the changes
    git cherry-pick $c
    
    $msg = "Update phase $($i + 1)"
    if ($i -lt $messages.Length) {
        $msg = $messages[$i]
    }
    
    git commit --amend -m $msg --author="dhairya2003vashishtha <dhairya2003vashishtha@gmail.com>"
}

# Replace main branch
git checkout main
git reset --hard new_main
git branch -D new_main

Write-Host "Git history rewritten successfully. Pushing to origin..."
git push -f origin main
