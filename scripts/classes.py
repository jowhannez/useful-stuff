from html.parser import HTMLParser
from os import path

classes = []
ignore  = [
    'content-width--large',
    'content-width--medium',
    'content-width--short'
]

class ClassParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for attr in attrs:
            if 'class' in attr:
                for a in attr[1].split(' '):
                    if '__' not in a and a not in classes and a not in ignore:
                        classes.append({a: []})
        for attr in attrs:
            for a in attr[1].split(' '):
                for c in classes:
                    for index in c:
                        if index != a and index in a and a.replace(index, '&') not in c[index]:
                            c[index].append(a.replace(index, '&'))

parser  = ClassParser()
file    = input('File to parse: ')
with open(file) as f:
    lines = f.read()
    parser.feed(lines)

scssDir = './'
for i in range(10):
    if path.exists(i * '../' + 'resources/scss/components'):
        scssDir = i * '../' + 'resources/scss/components/_'

output = ''
for c in classes:
    for index in c:
        output += '.' + index + ' {\n'
        for sc in c[index]:
            output += '\t' + sc + ' {\n\n\t}\n'
        output += '}'

        outFileName = scssDir + index + '.scss'
        if not path.exists(outFileName):
            outFile     = open(outFileName, "w")
            outFile.write(output)
            outFile.close()
            print('Made ' + outFileName)
        else:
            print(outFileName + ' already exists! Delete it if you want to generate an empty file with all classnames')
        
        output = ''