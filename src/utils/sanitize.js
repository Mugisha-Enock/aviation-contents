import sanitizeHtml from 'sanitize-html';
const dec=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
// Plain text: strip every tag. The frontend renders it as text, so decoding is safe.
export const plain=s=>dec(sanitizeHtml(String(s??''),{allowedTags:[],allowedAttributes:{}})).trim();
// Story body: small allow-list of editor tags, no scripts, styles, events or javascript: URLs.
export const rich=s=>sanitizeHtml(String(s??''),{
  allowedTags:['h2','h3','p','br','ul','ol','li','blockquote','strong','em','a','img','figure','figcaption'],
  allowedAttributes:{a:['href','target','rel'],img:['src','alt']},allowedSchemes:['http','https'],
  allowedSchemesByTag:{img:['http','https']},
  transformTags:{a:sanitizeHtml.simpleTransform('a',{rel:'noopener noreferrer'})}}).trim();
export const stripTags=s=>sanitizeHtml(String(s??''),{allowedTags:[],allowedAttributes:{}});
