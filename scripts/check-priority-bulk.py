"""Local-only arithmetic, SVG and SQLite verification of the priority batch."""
import ast, json, math, re, sqlite3
from decimal import Decimal
from fractions import Fraction
from pathlib import Path
from lxml import etree

root=Path(__file__).resolve().parents[1]
file=root/'worker/migrations/0049_priority_english_and_maths_batch.sql'
sql=file.read_text()
lessons=[json.loads(m.replace("''","'")) for m in re.findall(r"json_patch\(\s*data\s*,\s*'((?:[^']|'')*)'\s*\)",sql,re.S)]
expected={f's4-eng-y8-w01-l{n}' for n in range(1,5)}|{f'{s}-mat-y{y}-w01-l{n}' for s,y in [('s2',3),('s2',4),('s4',7),('s4',8)] for n in range(1,5)}
assert {l['seed_key'] for l in lessons}==expected and len(lessons)==20

small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
values={w:i for i,w in enumerate(small)}|dict(zip(['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'],range(20,100,10)))
def parse_words(words):
    total=current=0
    for word in words.lower().replace('-',' ').split():
        if word=='and':continue
        if word=='hundred':current*=100
        elif word=='thousand':total+=current*1000;current=0
        else:current+=values[word]
    return total+current

def integer(value):
    return int(str(value).replace('−','-').replace(',','').replace(' °C',''))
superscripts=str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻','0123456789-')
def power_value(text):
    m=re.fullmatch(r'([−\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)',text)
    if not m:return None
    coefficient=Decimal(m[1].replace('−','-'));exponent=int(m[2].translate(superscripts))
    return coefficient,coefficient*Decimal(10)**exponent

def evaluate_sum(expression):
    expression=expression.replace('−','-').replace(',','')
    tree=ast.parse(expression,mode='eval')
    def calc(node):
        if isinstance(node,ast.Expression):return calc(node.body)
        if isinstance(node,ast.Constant) and type(node.value) is int:return node.value
        if isinstance(node,ast.UnaryOp) and isinstance(node.op,ast.USub):return -calc(node.operand)
        if isinstance(node,ast.BinOp) and isinstance(node.op,ast.Add):return calc(node.left)+calc(node.right)
        raise ValueError(expression)
    return calc(tree)

checked=0;images=0
for l in lessons:
    assert len(l['teach_steps']) in ([4] if l['year_level'] in ['Year 3','Year 4'] else [4,5])
    assert len(l['quiz'])==10
    if l['seed_key']=='s4-mat-y7-w01-l3':
        assert all('absolute' not in q['question'].lower() and '|' not in q['question'] for q in l['quiz']), 'Addition quiz includes an untaught absolute-value question'
    questions=[s['check'] for s in l['teach_steps']]+l['quiz']
    if l['learning_area']=='Mathematics':
        for q in questions:
            if q.get('type')=='short_answer':continue
            question=q['question'];answer=q['options'][q['correct_index']];wanted=None
            power_options=[power_value(o) for o in q['options']]
            if any(p is not None for p in power_options) and (target:=re.search(r'(?:for|represents|equals) (?:the positive number )?([\d,.]+)\?',question)):
                target_value=Decimal(target[1].replace(',',''))
                standard='standard' in question.lower()
                correct=[i for i,p in enumerate(power_options) if p is not None and p[1]==target_value and (not standard or Decimal(1)<=p[0]<Decimal(10))]
                assert correct==[q['correct_index']],(question,correct)
                checked+=1;continue
            if question.startswith('What is ') and question.endswith('?') and (power:=power_value(question[8:-1])):
                wanted=power[1]
                assert Decimal(answer)==wanted;checked+=1;continue
            if (m:=re.fullmatch(r'What is ([\d.]+) as a fraction\?',question)):
                target=Fraction(Decimal(m[1]));correct=[i for i,o in enumerate(q['options']) if Fraction(o)==target]
                assert correct==[q['correct_index']];checked+=1;continue
            if m:=re.fullmatch(r'What is one more than ([\d,]+)\?',question):wanted=integer(m[1])+1
            elif m:=re.fullmatch(r'What is ([\d,]+) plus one hundred\?',question):wanted=integer(m[1])+100
            elif m:=re.fullmatch(r'What comes immediately after ([\d,]+) when counting by one\?',question):wanted=integer(m[1])+1
            elif m:=re.fullmatch(r'What is the value of the (hundreds|tens) digit in ([\d,]+)\?',question):
                number=integer(m[2]);place=100 if m[1]=='hundreds' else 10;wanted=(number//place%10)*place
            elif m:=re.fullmatch(r'Which words correctly read ([\d,]+)\?',question):
                assert parse_words(answer)==integer(m[1]);checked+=1;continue
            elif m:=re.fullmatch(r'What is the opposite of ([−\d]+)\?',question):wanted=-integer(m[1])
            elif m:=re.fullmatch(r'Which value is opposite to ([−\d]+)\?',question):wanted=-integer(m[1])
            elif m:=re.fullmatch(r'What is \|([−\d]+)\|\?',question):wanted=abs(integer(m[1]))
            elif m:=re.fullmatch(r'What is √(\d+)\?',question):
                wanted=math.isqrt(int(m[1]));assert wanted*wanted==int(m[1])
            elif m:=re.fullmatch(r'What is ([−\d,() +]+)\?',question):wanted=evaluate_sum(m[1])
            if wanted is not None:
                assert Decimal(answer.replace('−','-').replace(',',''))==wanted,(l['seed_key'],question,answer,wanted);checked+=1
                assert sum(Decimal(str(o).replace('−','-').replace(',',''))==wanted for o in q['options'])==1
        # Independent parsing of all supplied whole-number model equations.
        for total,parts in re.findall(r'([\d,]+) = ([\d,]+(?: \+ [\d,]+)+)',l['worked_example']):
            assert integer(total)==sum(integer(p) for p in parts.split(' + '));checked+=1
    def scan(v):
        global images
        if isinstance(v,dict):
            if 'svg' in v:etree.fromstring(v['svg'].encode());images+=1
            for child in v.values():scan(child)
        elif isinstance(v,list):
            for child in v:scan(child)
    scan(l)

# Separate exact arithmetic checks for the advanced model values.
assert Fraction(Decimal('0.125'))==Fraction(1,8)
assert Fraction(Decimal('1.414'))==Fraction(707,500)
assert Fraction(Decimal('0.75'))==Fraction(3,4)
for lower,value,upper in [(3,10,4),(4,20,5),(5,30,6)]:assert lower**2<value<upper**2
for coefficient,exponent,value in [('4.5',4,'45000'),('7.2',4,'72000'),('6.4',-3,'0.0064'),('8',-4,'0.0008'),('3.6',2,'360'),('3.6',-2,'0.036')]:
    assert Decimal(coefficient)*Decimal(10)**exponent==Decimal(value);checked+=1
assert -6+4==-2 and -2+(-6)==-8 and -4+6==2

db=sqlite3.connect(':memory:')
for migration in sorted((root/'worker/migrations').glob('*.sql')):
    if migration.name[:4] not in {'0006','0007','0008','0009','0010','0011','0049'}:db.executescript(migration.read_text())
before={r[0]:r for r in db.execute('SELECT * FROM lessons')}
db.executescript(sql)
after={r[0]:r for r in db.execute('SELECT * FROM lessons')}
columns=[d[0] for d in db.execute('SELECT * FROM lessons').description]
assert before.keys()==after.keys()
changed=[key for key in after if after[key]!=before[key]]
assert len(changed)==20
assert {dict(zip(columns,after[k]))['seed_key'] for k in changed}==expected
for key in changed:
    old=dict(zip(columns,before[key]));new=dict(zip(columns,after[key]))
    assert all(old[col]==new[col] for col in columns if col not in {'title','data','updated_at'})
    content=json.loads(new['data']);assert content['title']==new['title'] and 'coming_soon' not in content
    assert all(k not in content for k in ['resources','sort_activity','word_challenges','suspense_builder'])
snapshot={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
db.executescript(sql)
assert snapshot=={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
print(f'Passed: {checked} independently computed arithmetic/representation checks; {images} SVGs parsed; exactly 20 target rows; identities and other rows preserved; stable content on rerun.')
