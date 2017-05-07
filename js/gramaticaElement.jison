%lex
%%

\s+                                                     /* skip whitespace */
\r                                                      /* skip whitespace */
\n                                                      /* skip whitespace */
"%%"[^\n]*\n                                            /* skip comment */
"¿¿"[^"??"]*"??"                                        /* skip comment */
[0-9]+("."[0-9]+)?\b                                    return 'numero'
\"[^\"]*\"|\'[^\']*\'       yytext = yytext.substr(1,yyleng-2); return 'cadena';
"*"                                                     return '*'
"/"                                                     return '/'
"-"                                                     return '-'
"+"                                                     return '+'
"^"                                                     return '^'
"%"                                                     return '%'

"<="                                                    return '<='
">="                                                    return '>='
"<"                                                     return '<'
">"                                                     return '>'
"=="                                                    return '=='
"!="                                                    return '!='

"&&"                                                    return '&&'
"||"                                                    return '||'
"|?"                                                    return '|?'
"&?"                                                    return '&?'
"|&"                                                    return '|&'
"!"                                                     return '!'

"("                                                     return '('
")"                                                     return ')'
"{"                                                     return '{'
"}"                                                     return '}'
"["                                                     return '['
"]"                                                     return ']'
":"                                                     return ':'
";"                                                     return ';'
".."                                                    return '..'
"."                                                     return '.'
","                                                     return ','
"="                                                     return '='

"num"                                                   return 'num'
"str"                                                   return 'str'
"bool"                                                  return 'bool'
"void"                                                  return 'void'
"array"                                                 return 'array'
"true"                                                  return 'true'
"false"                                                 return 'false'
"of"                                                    return 'of'
"element"                                               return 'element'
"NULL"                                                  return 'NULL'
"create"                                                return 'create'
"if"                                                    return 'if'
"then"                                                  return 'then'
"else"                                                  return 'else'
"switch"                                                return 'switch'
"case"                                                  return 'case'
"default"                                               return 'default'
"break"                                                 return 'break'
"continue"                                              return 'continue'
"return"                                                return 'return'
"while"                                                 return 'while'
"do"                                                    return 'do'
"repeat"                                                return 'repeat'
"until"                                                 return 'until'
"for"                                                   return 'for'
"loop"                                                  return 'loop'
"count"                                                 return 'count'
"whilex"                                                return 'whilex'
"Principal"                                             return 'principal'

"outStr"                                                return 'outStr'
"outNum"                                                return 'outNum'
"inStr"                                                 return 'inStr'
"inNum"                                                 return 'inNum'
"show"                                                  return 'show'
"getRandom"                                             return 'getRandom'
"getLength"                                             return 'getLength'

[a-zA-Z]([a-zA-Z0-9_])*                                 return 'id'
<<EOF>>                                                 return 'EOF'
.                                                       return 'INVALID'

/lex

/* operator associations and precedence */

%left '||' '|?'
%left '&&' '&?'
%left '|&'
%right '!'
%left '==' '!=' '>' '<' '>=' '<='
%left '+' '-'
%left '*' '/'
%right '^'
%right '%'
%right '('
%left UMINUS

%start INICIO

%% /* language grammar */

INICIO          :   LELEMENT EOF {return $1;};

LELEMENT        :   LELEMENT ELEMENT {
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   ELEMENT { $$ = {nombre : "LELEMENT", hijos:[$1]}; };

ELEMENT         :   'element' ':' id '{' LCUERPOELE '}'{
                      $$ = {
                        nombre : "ELEMENT",
                        id : $3,
                        hijos : [$5]
                      };
                    };

LCUERPOELE      :   LCUERPOELE CUERPOELE {
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   CUERPOELE { $$ = {nombre : "LCUERPOELE", hijos:[$1]}; };

CUERPOELE       :   DECVAR ';' { $$ = $1; }
                |   DECARR ';'{ $$ = $1; }
                |   ELEMENT { $$ = $1; };

DECVAR          :   TIPO LVARIABLES ASIG {
                        $$ = {
                            nombre : "DECVAR",
                            tipo : $1,
                            hijos : [$2,$3]
                        };
                    };
ASIG            :   ':' VALOR { $$ = $2; }
                |   ':' 'create' '(' id ')' { $$ = {nombre : "NUEVO", id : $4}; }
                |   { $$ = {nombre : "NULL", valor : "NULL"}; };
LVARIABLES      :   LVARIABLES ',' id {
                        var lid = {nombre : "LID", hijos:[$3]};
                        $1.hijos.push(lid);
                        $$ = $1;
                    }
                |   id {
                      var lid = {nombre : "LID", hijos:[$1]};
                      $$ = {nombre : "LVARIABLES", hijos:[lid]};
                    };

DECARR          :   'array' ':' id LCORCHETES 'of' TIPO{
                        $$ = {
                            nombre : "ARRAY",
                            tipo : $6,
                            id : $3,
                            hijos : [$4]
                        };
                    };
LCORCHETES      :   LCORCHETES '[' RANGO ']' {
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   '[' RANGO ']' { $$ = {nombre : "LCORCHETES", hijos : [$2]}; };
RANGO           :   numero { $$ = {nombre : "RANGO", hijos : ["0", $1]}; }
                |   numero '..' numero { $$ = {nombre : "RANGO", hijos : [$1, $3]}; }
                |   { $$ = {nombre : "RANGO", hijos : []}; };

DECFUN          :   TIPOFUN L ':' id '(' LPAR ')' '{' LCUERPO '}' {
                        $$ = {
                            nombre : "FUNCION",
                            id : $4,
                            tipo : $1,
                            hijos : [$6, $9]
                        };
                        if($2 !== null)
                            $$.hijos.push($2);
                    };

TIPO            :   'num' { $$ = $1; }
                |   'str' { $$ = $1; }
                |   'bool' { $$ = $1; }
                |   LID {
                      if($1.hijos.length >= 2)
                      {//existe un error la variable no fue declarada correctamente
                        var er = {
                          tipo: "Error Semantico",
                          descripcion: "No se puede declarar una variable de tipo [" + $1.hijos.join(".") + "]",
                          fila: 0,
                          columna: 0
                        };
                        agregarError(er);
                      }
                      $$ = $1.hijos[0];

                    };

VALOR           :   VALOR '||' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '|&' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '&&' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '|?' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '&?' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   '!' VALOR { $$ = {nombre :$1, hijos:[$2]}; }
                |   REL { $$ = $1; };

REL             :   E OPREL E { $$ = {nombre : $2, hijos:[$1, $3]}; }
                |   E { $$ = $1; };
OPREL           :   '<' { $$ = '<'; }
                |   '>' { $$ = '>'; }
                |   '<=' { $$ = '<='; }
                |   '>=' { $$ = '>='; }
                |   '==' { $$ = '=='; }
                |   '!=' { $$ = '!='; };

E               :   E '+' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '-' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '*' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '/' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '%' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '^' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   '-' E { $$ = {nombre :$1, hijos:[$2]}; }
                |   numero { $$ = {nombre : "numero", valor : $1}; }
                |   cadena { $$ = {nombre : "cadena", valor : $1}; }
                |   'true' { $$ = {nombre : "bool", valor : $1}; }
                |   'false' { $$ = {nombre : "bool", valor : $1}; }
                |   'NULL' { $$ = {nombre : "NULL", valor : $1}; }
                |   LID { $$ = $1; }
                |   '(' VALOR ')' { $$ = $2; };

LID             :   LID '.' id {
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   id { $$ = {nombre : "LID", hijos:[$1]}; };
