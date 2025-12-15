# 🤝 Contributing Guidelines

Thank you for contributing!

## 🐛 Reporting Issues
Before submitting a pull request, make sure there is an existing issue describing the bug or feature.  
If not, please create one.

## 🔧 How to Contribute
1. **Fork** the repository  
2. Create a branch for your changes named with the GitFlow strategy:
    - Feature branch: feature/\<story number>_\<developer initials>\_\<descriptor>
    - Bugfix branch: bugfix/\<ticket>_\<developer initials>\_\<descriptor>
    - Hotfix branch: hotfix/\<ticket>\_\<developer initials>\_\<descriptor>
4. Make your updates using the Conventional Commits nomenclature:
  ```
    <type>[optional scope]: <description>

    [optional body]  

    [optional footer(s)]
  ```
  The type is: **fix**, **feat**, **breaking change** depending on the type of the issue. Nomenclature must be respected to allow automatic changlog generation.
  The git commit message template can be found in [commit message template](.github/gitmessage) and enforce with:
  ```bash
  git config commit.template .gitmessage
  ```
6. Open a **Pull Request**, and **link it to the related issue**

## ✔️ Pull Request Rules
- Keep changes focused on a single issue  
- Provide a clear description of what your PR does  
- Make sure your changes don't introduce errors
- All the tests must pass and the coverage must be of 80% or higher
- If you corrected a bug, add a test
- The check must pass

A non-blaming approach will be applied to avoid conflict and allow open, respectful communication and more focus on root cause analysis.

Thanks for helping improve the project!
