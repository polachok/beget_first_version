// �� �������� ���������� ������
function error_message(id)
{
    switch(id)
    {
    case '0':
        break;
    case '1':
        alert('������ ��� ��������� � ���������� �������, ���������� � ������ ��������� support@beget.ru.');
        break;
    case '2':
        alert('��������� �������� ��� ������');
        break;
    case '3':
        alert('�������� ��� ����� �������� ������ �� ���� ���������� ��������, ���� � �������� ������������� � ����');
        break;
    case '4':
        alert('�������� ��� ����������.');
        break;
    case '5':
        alert('������ �� ����������, ��������� � ������ ��������� support@beget.ru.');
        break;
    case '10':
        alert('����� ������ �� ����� ���� ����� ������ �������.');
        break;
    case '11':
        alert('����� ������ �� ����� ��������� 10 ��������.');
        break;
    case '12':
        alert('����� ����� �������� ������ �� ���� � ���� ���������� ��������, � ����� ����� �������������.');
        break;
    case '20':
        alert('����� ������ �� ����� ���� ����� ������ �������.');
        break;
    case '21':
        alert('����� ������ �� ����� ��������� 10 ��������.');
        break;
    case '22':
        alert('������ ����� �������� ������ �� ���� � ���� ���������� ��������, � ����� ����� �������������.');
        break;    
    default:
        alert('������ ������� (code:' + id + '), ���������� � ������ ��������� support@beget.ru.');
    }
}

function dropSubDomain(domain,subdomain)
{
    if (!confirm("�� ������������� ������ ������� �������� " + subdomain + "." + domain + "?")) return;
    ajax_drop_subdomain(domain,subdomain,function(req){
           var return_value = String(req.responseText);
           if (return_value == '0')
           {
              setTimeout("reload_table('subdomains_table');", 5);
              alert('����� ������� ���������.');
           } else
           {
              error_message(return_value);
           }
        });
}


function addSubDomain()
{
    var subdomain = document.getElementById("subdomain").value;
    var domain    = document.getElementById("domain").value;

    subdomain = new String(subdomain);
    if (subdomain.length == 0)
    {
        alert('������� ���������� ������� ���');
        return;
    }

    if (!check_domain(subdomain))
    {
        alert('�������� ��� ����� �������� ������ �� ���� ���������� ��������, ���� � �������� ������������� � ����');
        return;
    }

    ajax_add_subdomain(domain,subdomain,function(req){
           var return_value = String(req.responseText);
           if (return_value == '0')
           {
              setTimeout("reload_table('subdomains_table');", 5);
              alert('����� ������� ���������.');
           } else
           {
              error_message(return_value);
           }
        });
} 

var tables = new Array();

var table_fields = [ {name: 'domain',     size: '200',   caption: '�����'},
                     {name: 'subdomain',  size: '200',   caption: '��������'},
                     {name: 'do',         size: '150',   caption: '��������'}];

// �������� ���� �� �����
function get_field_hash(f_name){
  for(var i in table_fields)
      if (f_name == table_fields[i].name)
         return table_fields[i]
  return 0;
};

// ����������� ����� ��������
function count_cell_width(t_width, fields){

  var counters = new Array();
  for(var i in fields){
    var field = get_field_hash(fields[i]);
    if (field.size > 0) counters[i] = field.size; 
    else counters[i] = 100;
  };
  return counters;
};

function create_tag(tagname, id, options, style, inner){
  return "<" + tagname + ((id == "")?"":" id=\""+id+"\"") + ((options == "")?"":" "+options+"") + ((style == "")?"":" style=\""+style+"\"") + ">"+inner + "</" +tagname+">";
};

function create_s_tag(tagname, id, options, style){
  return "<" + tagname + ((id == "")?"":" id=\""+id+"\"") + ((options == "")?"":" "+options+"") + ((style == "")?"":" style=\""+style+"\"") + "/>";
};

// �������� ���� �� �����
function get_field_hash(f_name){
  for(var i in table_fields)
      if (f_name == table_fields[i].name)
          return table_fields[i];
  return 0;
};

// �������� ������� �� ������
function get_table(name){
  for (var i in tables)  
      if (tables[i].name == name)  
          return tables[i];
};

// ��������� �������
function save_table(name, table){
  for (var i in tables)
    if (tables[i].ft_name == name){
      tables[i] = table;
      return;
  };
};

function init_table(name, t_width, fields, methods){
  var table = {  name:      name, 
                 width:     t_width,
                 fields:    fields,
                 methods:   methods
               };
  tables.push(table);
  document.write(create_tag("div", "div_ft_" + name, "", "", ""));
};

function load_list(nametable,callback){
  ajax_load_list(
    function(req){
      var returnArray = String(req.responseText).split("\n");
      var list = new Array();
      for(var i in returnArray){
        var element = returnArray[i];
        if (String(element).length > 0){
          var a_list = String(element).split("|");
          var type     = a_list[0]
          var domain   = a_list[1];
          var subdomain = a_list[2];
          if (type.length > 0){
              list.push({type: type, domain: domain, subdomain: subdomain});
          };
        };
      };
      callback(nametable, list);
    }
  );
};

function reload_table(name)
{
  var table = get_table(name);
  var c_width = count_cell_width(table.width, table.fields);

  var h_fields = "";
  for(var i in table.fields){
    var field = get_field_hash(table.fields[i]);
    var width = c_width[i];
    h_fields = h_fields + create_tag("td", "", "class=\"tableheader\" width=\""+width+"\"", "", 
      create_tag("center", "", "", "", field.caption));
  };

  table.methods.get_list(name,
    function(name,list){
      var table = get_table(name);
      var files_tag = "";
      var flag = '0';

      if (list.length == 0); else 
      for(f_i in list){
        var c_returned = list[f_i];

        var cells_tag = "";
        for(var i in table.fields){
          var field = get_field_hash(table.fields[i]);

          var caption = "";
          switch(field.name){
            case 'domain':
                if (c_returned.type == 'd'){
                    if (c_returned.subdomain != '0') {
                        caption = create_tag("strong", "", "", "color:red;", "&nbsp;&nbsp;&nbsp; www." + c_returned.domain + " (" + c_returned.subdomain + ")");
                    }  else
                    {
                        caption = create_tag("strong", "", "", "", "&nbsp;&nbsp;&nbsp; www." + c_returned.domain + " (0)");
                    }
                }
                break;
            case 'subdomain':
                if (c_returned.type == 's'){
                    caption = create_tag("div", "", "", "", "&nbsp;&nbsp;&nbsp; www." + c_returned.subdomain + "." + c_returned.domain);
                }
                break;
             case 'do':
                if (c_returned.type == 's'){
                    caption = create_tag("center", "", "", "", create_tag("a", "", "href=\"#\" onclick=\"javascript:dropSubDomain('" + c_returned.domain + "','"+c_returned.subdomain+"');return false;\"", "",
                    create_s_tag("img", "", "src=\"images/del.png\" border=\"0\" alt=\"������� �������� "+c_returned.subdomain+"."+c_returned.domain+"\" title=\"�������� �������� "+c_returned.subdomain+"."+c_returned.domain+"\"", ""))
                );
                }
                break;
            };
          cells_tag = cells_tag + create_tag("td", "", "align=\"left\" ", "", caption);
        };
        if (c_returned.type == 'd')
            files_tag = files_tag + create_tag("tr", "subdomain_table_d_"+ c_returned.domain, "class=\"tabledata1\"", "", cells_tag);
        else
            files_tag = files_tag + create_tag("tr", "subdomain_table_s_"+ c_returned.subdomain, "class=\"tabledata2\"", "", cells_tag);
    };

    var file_table = create_tag("table", "", "border=0 cellpadding=1 cellspacing=1", "", 
      create_tag("tr", "", "", "", h_fields) + files_tag
    );

    document.getElementById("div_ft_" + table.name).innerHTML = file_table;
    save_table(name, table);
    }
  );
}
