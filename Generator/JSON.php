<?php

require_once 'Services/JSON.php';


class Pman_Builder_Generator_JSON extends Services_JSON 
{
     var $indent = 0;

    var $crlf = "\n";
    var $tab = "\t";
 
    function Pman_Builder_Generator_JSON($use = 0) {
         if (is_array($use)) {
            foreach($use as $k=>$v) {
                $this->$k = $v;
            }
        } else {
            $this->use = $use;
            
        }
        $this->indent = 0;
        
    }
    
    function _encode($var) 
    {
         
        switch (gettype($var)) {
            case 'boolean':
                return $var ? 'true' : 'false';

            case 'NULL':
                return 'null';

            case 'integer':
                return (int) $var;

            case 'double':
            case 'float':
                return (float) $var;

            case 'string':
                // STRINGS ARE EXPECTED TO BE IN ASCII OR UTF-8 FORMAT
                $ascii = '';
                $strlen_var = strlen($var);

               /*
                * Iterate over every character in the string,
                * escaping with a slash or encoding to UTF-8 where necessary
                */
                for ($c = 0; $c < $strlen_var; ++$c) {

                    $ord_var_c = ord($var{$c});

                    switch (true) {
                        case $ord_var_c == 0x08:
                            $ascii .= '\b';
                            break;
                        case $ord_var_c == 0x09:
                            $ascii .= '\t';
                            break;
                        case $ord_var_c == 0x0A:
                            $ascii .= '\n';
                            break;
                        case $ord_var_c == 0x0C:
                            $ascii .= '\f';
                            break;
                        case $ord_var_c == 0x0D:
                            $ascii .= '\r';
                            break;

                        case $ord_var_c == 0x22:
                        case $ord_var_c == 0x2F:
                        case $ord_var_c == 0x5C:
                            // double quote, slash, slosh
                            $ascii .= '\\'.$var{$c};
                            break;

                        case (($ord_var_c >= 0x20) && ($ord_var_c <= 0x7F)):
                            // characters U-00000000 - U-0000007F (same as ASCII)
                            $ascii .= $var{$c};
                            break;

                        case (($ord_var_c & 0xE0) == 0xC0):
                            // characters U-00000080 - U-000007FF, mask 110XXXXX
                            // see http://www.cl.cam.ac.uk/~mgk25/unicode.html#utf-8
                            if ($c+1 >= $strlen_var) {
                                $c += 1;
                                $ascii .= '?';
                                break;
                            }
                            
                            $char = pack('C*', $ord_var_c, ord($var{$c + 1}));
                            $c += 1;
                            $utf16 = $this->utf82utf16($char);
                            $ascii .= sprintf('\u%04s', bin2hex($utf16));
                            break;

                        case (($ord_var_c & 0xF0) == 0xE0):
                            if ($c+2 >= $strlen_var) {
                                $c += 2;
                                $ascii .= '?';
                                break;
                            }
                            // characters U-00000800 - U-0000FFFF, mask 1110XXXX
                            // see http://www.cl.cam.ac.uk/~mgk25/unicode.html#utf-8
                            $char = pack('C*', $ord_var_c,
                                         @ord($var{$c + 1}),
                                         @ord($var{$c + 2}));
                            $c += 2;
                            $utf16 = $this->utf82utf16($char);
                            $ascii .= sprintf('\u%04s', bin2hex($utf16));
                            break;

                        case (($ord_var_c & 0xF8) == 0xF0):
                            if ($c+3 >= $strlen_var) {
                                $c += 3;
                                $ascii .= '?';
                                break;
                            }
                            // characters U-00010000 - U-001FFFFF, mask 11110XXX
                            // see http://www.cl.cam.ac.uk/~mgk25/unicode.html#utf-8
                            $char = pack('C*', $ord_var_c,
                                         ord($var{$c + 1}),
                                         ord($var{$c + 2}),
                                         ord($var{$c + 3}));
                            $c += 3;
                            $utf16 = $this->utf82utf16($char);
                            $ascii .= sprintf('\u%04s', bin2hex($utf16));
                            break;

                        case (($ord_var_c & 0xFC) == 0xF8):
                            // characters U-00200000 - U-03FFFFFF, mask 111110XX
                            // see http://www.cl.cam.ac.uk/~mgk25/unicode.html#utf-8
                            if ($c+4 >= $strlen_var) {
                                $c += 4;
                                $ascii .= '?';
                                break;
                            }
                            $char = pack('C*', $ord_var_c,
                                         ord($var{$c + 1}),
                                         ord($var{$c + 2}),
                                         ord($var{$c + 3}),
                                         ord($var{$c + 4}));
                            $c += 4;
                            $utf16 = $this->utf82utf16($char);
                            $ascii .= sprintf('\u%04s', bin2hex($utf16));
                            break;

                        case (($ord_var_c & 0xFE) == 0xFC):
                        if ($c+5 >= $strlen_var) {
                                $c += 5;
                                $ascii .= '?';
                                break;
                            }
                            // characters U-04000000 - U-7FFFFFFF, mask 1111110X
                            // see http://www.cl.cam.ac.uk/~mgk25/unicode.html#utf-8
                            $char = pack('C*', $ord_var_c,
                                         ord($var{$c + 1}),
                                         ord($var{$c + 2}),
                                         ord($var{$c + 3}),
                                         ord($var{$c + 4}),
                                         ord($var{$c + 5}));
                            $c += 5;
                            $utf16 = $this->utf82utf16($char);
                            $ascii .= sprintf('\u%04s', bin2hex($utf16));
                            break;
                    }
                }

                return (strpos($ascii, "'") > -1) ? '"'.$ascii.'"' : "'".$ascii."'";

            case 'array':
               /*
                * As per JSON spec if any array key is not an integer
                * we must treat the the whole array as an object. We
                * also try to catch a sparsely populated associative
                * array with numeric keys here because some JS engines
                * will create an array with empty indexes up to
                * max_index which can cause memory issues and because
                * the keys, which may be relevant, will be remapped
                * otherwise.
                *
                * As per the ECMA and JSON specification an object may
                * have any string as a property. Unfortunately due to
                * a hole in the ECMA specification if the key is a
                * ECMA reserved word or starts with a digit the
                * parameter is only accessible using ECMAScript's
                * bracket notation.
                */

                // treat as a JSON object
                if (is_array($var) && count($var) && (array_keys($var) !== range(0, sizeof($var) - 1))) {
                    $var = (object) $var;
                    // drop throug to object.!
                } else {
                        

                    // treat it like a regular array
                    $elements = array_map(array($this, '_encode'), $var);

                    foreach($elements as $element) {
                        if(Services_JSON::isError($element)) {
                            return $element;
                        }
                    }

                    return '[' . join(',', $elements) . ']';
                }
                // fall through for associative arrays..
                
            case 'object':
                $vars = get_object_vars($var);
                $this->indent++;
                $properties = array_map(array($this, 'name_value'),
                                        array_keys($vars),
                                        array_values($vars));
                $this->indent--;
                foreach($properties as $property) {
                    if(Services_JSON::isError($property)) {
                        return $property;
                    }
                }
                
                $ind = str_repeat($this->tab, $this->indent);
                $indx = $ind. $this->tab;
                return "{" . $this->crlf . $indx .  join(",". $this->crlf . $indx, $properties) . $this->crlf .$ind."}";

            default:
                return ($this->use & SERVICES_JSON_SUPPRESS_ERRORS)
                    ? 'null'
                    : new Services_JSON_Error(gettype($var)." can not be encoded as JSON string");
        }
    }
    
    function name_value($name, $value)
    {
        $encoded_value = $this->_encode($value);

        if(Services_JSON::isError($encoded_value)) {
            return $encoded_value;
        }
        $lv = strval($name);
        // do not escape keyvalues if they are just text, and not keywords...
        if (preg_match('/^[a-z_]+$/i', $lv)) {
            if (!in_array($lv, $GLOBALS['Pman_Builder_Generator_JSON']['keywords'])) {
                return $lv .' : ' . $encoded_value;
            }
            
        }
        
        return $this->_encode(strval($name)) . ' : ' . $encoded_value;
    }

}


$GLOBALS['Pman_Builder_Generator_JSON']['keywords'] = array(
    'break',
    'continue',
    'do',
    'for',
    'import',
    'new',
    'this',
    'void',
    'case',
    'default',
    'else',
    'function',
    'in',
    'return',
    'typeof',
    'while',
    'comment',
    'delete',
    'export',
    'if',
    'label',
    'switch',
    'var',
    'with',
    'abstract',
    'implements',
    'protected',
    'boolean',
    'instanceOf',
    'public',
    'byte',
    'int',
    'short',
    'char',
    'interface',
    'static',
    'double',
    'long',
    'synchronized',
    'false',
    'native',
    'throws',
    'final',
    'null',
    'transient',
    'float',
    'package',
    'true',
    'goto',
    'private',
    'catch',
    'enum',
    'throw',
    'class',
    'extends',
    'try',
    'const',
    'finally',
    'debugger',
    'super',
    'alert',
    'eval',
    'Link',
    'outerHeight',
    'scrollTo',
    'Anchor',
    'FileUpload',
    'location',
    'outerWidth',
    'Select',
    'Area',
    'find',
    'Location',
    'Packages',
    'self',
    'arguments',
    'focus',
    'locationbar',
    'pageXoffset',
    'setInterval',
    'Array',
    'Form',
    'Math',
    'pageYoffset',
    'setTimeout',
    'assign',
    'Frame',
    'menubar',
    'parent',
    'status',
    'blur',
    'frames',
    'MimeType',
    'parseFloat',
    'statusbar',
    'Boolean',
    'Function',
    'moveBy',
    'parseInt',
    'stop',
    'Button',
    'getClass',
    'moveTo',
    'Password',
    'String',
    'callee',
    'Hidden',
    // 'name', // why???
    'personalbar',
    'Submit',
    'caller',
    'history',
    'NaN',
    'Plugin',
    'sun',
    'captureEvents',
    'History',
    'navigate',
    'print',
    'taint',
    'Checkbox',
    'home',
    'navigator',
    'prompt',
    'Text',
    'clearInterval',
    'Image',
    'Navigator',
    'prototype',
    'Textarea',
    'clearTimeout',
    'Infinity',
    'netscape',
    'Radio',
    'toolbar',
    'close',
    'innerHeight',
    'Number',
    'ref',
    'top',
    'closed',
    'innerWidth',
    'Object',
    'RegExp',
    'toString',
    'confirm',
    'isFinite',
    'onBlur',
    'releaseEvents',
    'unescape',
    'constructor',
    'isNan',
    'onError',
    'Reset',
    'untaint',
    'Date',
    'java',
    'onFocus',
    'resizeBy',
    'unwatch',
    'defaultStatus',
    'JavaArray',
    'onLoad',
    'resizeTo',
    'valueOf',
    'document',
    'JavaClass',
    'onUnload',
    'routeEvent',
    'watch',
    'Document',
    'JavaObject',
    'open',
    'scroll',
    'window',
    'Element',
    'JavaPackage',
    'opener',
    'scrollbars',
    'Window',
    'escape',
    'length',
    'Option',
    'scrollBy'
);