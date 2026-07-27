"""Trạng thái dùng chung giữa startup và các endpoint.

Truy cập qua hàm (get/set) thay vì import trực tiếp biến, vì
`from ai.state import VECTOR_DB` sẽ chụp giá trị None tại thời điểm import
và không thấy được giá trị gán trong startup.
"""

from typing import Any, Optional

_VECTOR_DB: Optional[Any] = None


def set_vector_db(vs: Optional[Any]) -> None:
    global _VECTOR_DB
    _VECTOR_DB = vs


def get_vector_db() -> Optional[Any]:
    return _VECTOR_DB
