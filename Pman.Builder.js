/**
 *
 *
 * Core utils for builder..
 *
 */





Pman.Builder = {
 
    typemap : {
        'bool' : 'boolean',
        
        'date' : 'date',
        'datetime' : 'date',
        'time' : 'string', //bogus
        
        'int' : 'int',
        'int4' : 'int',
        'bigint' : 'int',
        'tinyint' : 'int',
        'smallint' : 'int',
        'timestamp' : 'number',
        
        'double' : 'float',
        'decimal' : 'float',
        'float' : 'float',
        
        'char' : 'string',
        'varchar' : 'string',
        'text' : 'string',
        'longtext' : 'string',
        'tinytext' : 'string',
        'mediumtext' : 'string',
        'enum' : 'string',
        
        'blob' : 'string'
    },
    /**
     * auto builders..
     * @param {Object} cfg the configuration
     * @param {Object} old the previous def...
     *  - table
     *  - cols_ex : [ name, name]
     *  - cols : [ 
     *      { column : name
     *        ctype : ctype,
     *        desc : desc
     *      }
     *   ]
     * 
     */
 
    
 
    
}