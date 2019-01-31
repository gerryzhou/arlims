select 'drop table ' || table_name || ' cascade constraints purge;' drop_command
from user_tables
where table_name not like 'DR$%'
union all
select 'drop view ' || view_name || ';' drop_command
from user_views
;

purge recyclebin;
