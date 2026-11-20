from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image
from urllib.parse import urlparse
import subprocess, re
root=Path(__file__).resolve().parent
soup=BeautifulSoup((root/'index.html').read_text(encoding='utf-8'),'html.parser')
assets=[]
for tag in soup.select('[src],[poster],link[rel="stylesheet"][href]'):
 u=tag.get('src') or tag.get('poster') or tag.get('href')
 if u and not u.startswith(('http:', 'https:', 'data:', '//')):
  assets.append(u.split('?',1)[0])
assert all((root/a).is_file() for a in assets),[a for a in assets if not (root/a).is_file()]
assert soup.html.get('lang')=='es'
assert len(soup.select('h1'))==1
assert all(x.get('alt') is not None for x in soup.select('img'))
assert all(x.get('width') and x.get('height') for x in soup.select('img'))
assert len(soup.select('img'))==20
local_images={a for a in assets if a.startswith('images/')}
assert len(local_images)==21
assert all(a.startswith('images/es/') for a in local_images)
assert len([a for a in assets if a.startswith('media/es/')])==4
assert len(soup.select('[data-bw3d-checkout]'))==2
assert soup.select_one('#comprar') is not None
config=(root/'js/config.js').read_text()
checkout=re.search(r'checkoutUrl:\s*"([^"]+)"', config)
assert checkout, 'Falta la URL del checkout'
payment_url=urlparse(checkout.group(1))
assert payment_url.scheme=='https' and payment_url.netloc=='pay.cakto.com.br' and payment_url.path.strip('/')
assert all(a.get('href')==checkout.group(1) for a in soup.select('[data-bw3d-checkout]'))
# Validate inline JS as well, not only external JS files.
for i,s in enumerate(soup.find_all('script')):
 if s.get('src') or not s.string or not s.string.strip(): continue
 tmp=root/('.bw3d_inline_check_%s.js' % i)
 try:
  tmp.write_text(s.string,encoding='utf8')
  subprocess.run(['node','--check',str(tmp)],check=True,capture_output=True)
 finally:
  tmp.unlink(missing_ok=True)
assert not any(x in (root/'index.html').read_text().lower() for x in ['impultienda.ar','shopify.com'])
for p in (root/'js').glob('*.js'):
 subprocess.run(['node','--check',str(p)],check=True)
for a in local_images:
 with Image.open(root/a) as im: im.verify()
assert all(a.get('href')=='#comprar' for a in soup.select('a[href^="#"]'))
print('APROVADO: estrutura, imagens, recursos locais, CTAs, sintaxe JS')
