//This file is for PEG.js and searchRecipesAdvancedPEG.js
export const pegGrammar = `
Query
  = Expression

Expression
  = OrExpression

OrExpression
  = left:AndExpression right:(_ "OR" _ AndExpression)* {
      return right.reduce((acc, [, , , term]) => ({
        type: "OR",
        left: acc,
        right: term
      }), left);
    }

AndExpression
  = left:NotExpression right:(_ ("AND" / _) NotExpression)* {
      return right.reduce((acc, [, , term]) => ({
        type: "AND",
        left: acc,
        right: term
      }), left);
    }

NotExpression
  = "-" expr:PrimaryExpression { return { type: "NOT", value: expr }; }
  / PrimaryExpression

PrimaryExpression
  = KeyValueExpression
  / Term

KeyValueExpression
  = key:Key ":" value:ValueExpression { return { type: "TERM", key, value }; }

Key
  = ComplexKey
  / SimpleKey

ComplexKey
  = base:SimpleKey "." subkey:SimpleKey { return { base, subkey }; }

SimpleKey
  = "name" / "type" / "ingredients" / "any" / "alcohol_content"

ValueExpression
  = BracketedExpression
  / Term

BracketedExpression
  = "(" _ expr:Expression _ ")" { return expr; }

Term
  = QuotedString
  / WildcardString

QuotedString
  = '"' chars:[^"]* '"' { return { type: "EXACT", value: chars.join('') }; }

WildcardString
  = chars:([^":\\s()<>=/] / "\\\\" .)+ {
      const value = chars.map(c => Array.isArray(c) ? c[0] : c).join('');
      if (value.startsWith('*') && value.endsWith('*')) return { type: "CONTAINS", value: value.slice(1, -1) };
      if (value.startsWith('*')) return { type: "ENDS_WITH", value: value.slice(1) };
      if (value.endsWith('*')) return { type: "STARTS_WITH", value: value.slice(0, -1) };
      return { type: "PARTIAL", value };
    }

_ "whitespace"
  = [ \\t\\n\\r]*
`;