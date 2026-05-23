import pytest
from calculator import multiply

def test_multiply():
    assert multiply(7, 8) == 56
    assert multiply(-3, 4) == -12
    assert multiply(0, 10) == 0
    assert multiply(5, 5) == 25
    assert multiply(-2, -3) == 6
