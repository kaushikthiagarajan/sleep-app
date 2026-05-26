import pytest
from calculator import multiply

def test_multiply():
    assert multiply(7, 8) == 56
    assert multiply(-3, 4) == -12
    assert multiply(0, 10) == 0
    assert multiply(5, 5) == 25
    assert multiply(-2, -3) == 6


def test_multiply_positive():
    assert multiply(4, 5) == 20


def test_multiply_zero():
    assert multiply(0, 7) == 0


def test_multiply_negative():
    assert multiply(-3, 6) == -18


def test_multiply_floats():
    assert multiply(2.5, 4) == 10.0
    assert multiply(1.5, 2.5) == 3.75
    assert multiply(-2.0, 3.0) == -6.0
