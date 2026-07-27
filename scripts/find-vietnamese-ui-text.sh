#!/bin/bash
# Tìm chuỗi tiếng Việt còn sót trong mã nguồn giao diện (web/mobile).
#
# Lớp ký tự phải ĐẦY ĐỦ: ngoài à á ả ã ạ còn các dạng tổ hợp ậ ầ ấ ẩ ẫ ế ề ệ
# ộ ố ồ ổ ỗ ớ ờ ở ỡ ợ ứ ừ ử ữ ự … Thiếu chúng sẽ báo "sạch" nhầm.
#
# Dùng: bash scripts/find-vietnamese-ui-text.sh [đường-dẫn...]

VN='[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸ]'

TARGETS=${*:-"apps/web/src apps/mobile/app apps/mobile/components"}

# Bỏ qua các dòng chỉ là comment (// ... /* ... * ... {/* ...)
grep -rnE "$VN" $TARGETS 2>/dev/null \
  | grep -vE '^[^:]+:[0-9]+: *(//|/\*|\*|\{/\*)'
