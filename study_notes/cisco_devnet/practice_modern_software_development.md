# Practice Modern Software Development

## Rise of APIs

- Modular Software Design
- Prototyping and testing API integration
- Challenges in consuming networked APIs
- Distributed computing patterns

1. Code
2. Build
3. Deploy
    1. Automation Workflow
        1. Server
        2. Application
        3. Network
4. Test

## API Data Formats

- YAML - YAML Ain't Markup Language
  - Transformation with XSL
  - Applying XML schemas
- JSON - JavaScript Object Notation
  - Communication Server web page
  - Configuration Files
- XML - eXtensible Markup Language
  - Configuration Files

## Serialization and Deserialization

pip install <library_name>

Data Formation|Library Name|Commands
-|-|-
YAML|PyYAML|pip install PyYAML
YAML|PyYAML|import yaml
YAML|ruaml.yaml|pip install ruaml.yaml
YAML|ruaml.yaml|from ruaml.yaml import YAML
JSON|json|import json
JSON|xmltodict|pip install xmltodict
JSON|xmltodict|import xmltodict
XML|untangle|pip install untangle
XML|untangle|import untangle
XML|minidom|import xml.dom.minidom
XML|ElementTree|import xml.etree.ElementTree

YAML|Python
-|-
object|dict
array|list
string|str
number (int)|int
number (real)|float
true|True
false|False
null|None

```python
yaml.safe.load() #Convert YAML to Python dictionary

yaml.dump() #Save a YAML file from a dictionary
```

JSON|Python
-|-
object|dict
array|list
string|str
number (int)|int
number (real)|float
true|True
false|False
null|None

```python
json.load() #Convert JSON to Python dictionary
json.dumps() #Convert Python dictionary to a JSON file
```

XML Library|Python element and example
-|-
minidom|DOM object
-|```user.getElementByTagName('name')[0].firstChild.data```
ElementTree|Element Tree
-|```user.find('name').text```
xmltodict|Dictionary
-|```user.['name']```
untangle|Object
-|```user.name.cdata```

## Collaborative Software Development

## Version Control with Git

Created in 2005.

**Remote repository** - Where the files of the project reside.

**Local Respository** - Local repository where snapshots or commits are stored.

**Staging Area** - Where all the intended changes are placed.

**Working Directory** - Controlled by Git. Tracks the differences between the working directory and local repository. Between local repository and remote repository.

**Git Command**|**Description**
-|-
git init|Initialize a directory for a Git project
git config <*parameters*>|Configure Git parameters such as usename and email address
git status|Check the status of your project
git add <*file*/*dir*>|Start tracking files and add them to the staging area
git rm <*file*/*dir*>|Stop tracking files.
git commit -m <*message*>|Create a local snapshot
git remote <*parameters*>|Manage Remote Repositories
git pull and fetch <*parameters*>|Fetch changes from the remote repository
git push <*parameters*>|Send commited changes to the remote repository

git pull merges into local branch
git fetch copies to local repository

