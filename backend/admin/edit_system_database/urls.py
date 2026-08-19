from django.urls import path
from .views import (
    list_system_tables,
    list_table_records,
    get_record_detail,
    update_system_record,
)

urlpatterns = [
    path('tables/', list_system_tables, name='edit_db_tables'),
    path('records/', list_table_records, name='edit_db_records'),
    path('record/detail/', get_record_detail, name='edit_db_record_detail'),
    path('record/update/', update_system_record, name='edit_db_record_update'),
]
