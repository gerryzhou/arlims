/* Oracle

select 'drop table ' || table_name || ' cascade constraints purge;' drop_command
from user_tables
where table_name not like 'DR$%'
union all
select 'drop view ' || view_name || ';' drop_command
from user_views
;

purge recyclebin;

*/

/* Postgres

select 'drop table if exists "' || tablename || '" cascade;'
  from pg_tables
where schemaname = 'public'
union all
select 'drop view if exists "' || viewname || '" cascade;'
from pg_views
where schemaname = 'public'
;

   */

