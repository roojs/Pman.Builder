//<script type="text/javascript">

Pman.Readers.Builder = {
	root : 'data',
	totalProperty : 'total',
	id : 'id',
	xtype : 'JsonReader',
	fields : [
		{name : 'id',type : 'int'},
		'name',
		'json',
		'btype',
		'app',
		'module'
	]
};

Pman.Readers.Builder_app = {
	root : 'data',
	totalProperty : 'total',
	id : 'id',
	xtype : 'JsonReader',
	fields : [
		{name : 'id',type : 'int'},
		'app',
		'davurl',
		{name : 'davwrite',type : 'int'}
	]
};
